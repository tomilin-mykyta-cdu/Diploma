import { Resolver, Query, ResolveField, Parent, Args, Mutation, Int, ObjectType, Field } from '@nestjs/graphql';
import { MarketDemandRepository } from './MarketDemand.repository';
import { MarketDemandEntity, MarketDemandForecast } from './MarketDemand.entity';
import { ProductionEntity } from '../production/Production.entity';
import { ProductionRepository } from '../production/Production.repository';
import { UkraineRegionEntity } from '../ukraineRegion/UkraineRegion.entity';
import { UkraineRegionRepository } from '../ukraineRegion/UkraineRegion.repository';
import { GetMarketDemandDto } from './dto/GetMarketDemand.dto';
import { MarketDemandService } from './MarketDemand.service';
import { Pagination } from '../../common/Pagination';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { CreateMarketDemandMutationDto } from './dto/CreateMarketDemandMutation.dto';
import { BaseResolver } from '../../hz/Base.resolver';

import { RandomForestRegression as RFRegression } from 'ml-random-forest';
import { GetMarketDemandDtoForecastAmount } from './dto/GetMarketDemandForecastAmount.dto';
import { getWeekNumber } from '../../common/utils';
import {
	RecordResponse
} from './dto/GetMarketDemandForecastAmountResponse.dto';
import { RandomForestService } from '../../services/RandomForest.service';

@Resolver(() => MarketDemandEntity)
export class MarketDemandResolver extends BaseResolver<MarketDemandEntity> {
	private createdInstances = 0;
	constructor(
		service: MarketDemandService,
		repository: MarketDemandRepository,
		sseService: ServerSideEventsService,
		private readonly productionRepository: ProductionRepository,
		private readonly ukraineRegionRepository: UkraineRegionRepository,
		private readonly randomForest: RandomForestService
	) {
		super(service, repository, sseService);
	}

	@Query(() => [MarketDemandEntity])
	async getMarketDemands(
		@Args('filter', { nullable: true, type: () => GetMarketDemandDto })
		filter?: GetMarketDemandDto,
		@Args('pagination', { nullable: true, type: () => Pagination })
		pagination?: Pagination
	): Promise<MarketDemandEntity[]> {
		return this.repository.findManyByCriteria(this.service.buildFindManyOptions({ filter, pagination }));
	}


	@Query(() => RecordResponse)
	async getMarketDemandsForecastAmount(
		@Args('filter', { nullable: true, type: () => GetMarketDemandDtoForecastAmount })
		filter?: GetMarketDemandDtoForecastAmount,
		@Args('pagination', { nullable: true, type: () => Pagination })
		pagination?: Pagination
	): Promise<RecordResponse> {
		const data = await this.repository.findManyByCriteria(this.service.buildFindManyOptions({
			filter,
			pagination
		}), this.repository.getRelations());

		const parsed = data.reduce((acc, x) => {
			const date = new Date(x.createdAt);
			const year = date.getFullYear();
			const weekNumber = getWeekNumber(date);
			const month = date.getMonth();
			const key = (filter.period === 'weekly' ? [year, month, weekNumber] : [year, month]).join('_');
			if (!acc[key]) {
				acc[key] = 0;
			}
			acc[key] += 1;
			return acc;
		}, {});

		const records = Object.keys(parsed).map(x => {
			const [year, month, weekNumber] = x.split('_');
			return { count: +parsed[x], year: +year, month: +month, week: isNaN(+weekNumber) ? null : +weekNumber };
		});

		return {
			records
		};
	}

	@Query(() => [MarketDemandForecast])
	async getMarketDemandsForecast(
		@Args('filter', { nullable: true, type: () => GetMarketDemandDto })
		filter?: GetMarketDemandDto,
		@Args('pagination', { nullable: true, type: () => Pagination })
		pagination?: Pagination
	): Promise<MarketDemandForecast[]> {
		const data = await this.repository.findManyByCriteria(this.service.buildFindManyOptions({
			filter,
			pagination
		}), this.repository.getRelations());

		const accumulator = data
			.reduce((acc, x) => {
				const id = `${x.production.feed.feedTitle.id - 1}_${x.ukraineRegion.id - 1}_${x.production.feed.animalSpecies.id - 1}_${x.production.feed.feedSegment.id - 1}`;
				if (!acc[id]) {
					acc[id] = 0;
				}
				acc[id] += 1;
				return acc;
			}, {});

		const trainingSet = [];
		const predictions = [];
		for (const id in accumulator) {
			const [feedId, ukraineRegionId, animalSpeciesId, feedSegmentId] = id.split('_');
			const count = accumulator[id];
			trainingSet.push([+feedId, +ukraineRegionId, +animalSpeciesId, +feedSegmentId]);
			predictions.push(count);
		}

		const options = {
			seed: 3,
			maxFeatures: 2,
			replacement: false,
			nEstimators: 200
		};

		const regression = new RFRegression(options);
		regression.train(trainingSet, predictions);
		const prediction = regression.predict(trainingSet);

		const result = data.map((x, i) => ({
			...x,
			prediction: prediction[i]
		}) as MarketDemandForecast);

		return result;
	}

	@Mutation(() => MarketDemandEntity)
	async createMarketDemand(
		@Args('body', { nullable: false, type: () => CreateMarketDemandMutationDto })
		body: CreateMarketDemandMutationDto
	) {
		const instance = await super.create(body, EVENTS.MARKET_DEMAND);
		if (this.createdInstances + 1 >= 1) {
			await this.randomForest.trainThisMonth();
			const predictions = await this.getPredictions();
			this.sseService.emitEvent(EVENTS.TRAIN_PREDICTION_MODEL, predictions);
			this.createdInstances = 0;


		}

		return instance;
	}

	@Query(() => MarketDemandEntity, { nullable: true })
	async getMarketDemand(
		@Args('filter', { nullable: true, type: () => GetMarketDemandDto })
		filter?: GetMarketDemandDto
	): Promise<MarketDemandEntity> {
		return this.repository.findOneByCriteria(this.service.buildWhereObject(filter));
	}

	@Query(() => [PredictionsResponse], { nullable: true })
	async getPredictions(): Promise<PredictionsResponse[]> {
		const now = new Date();

		const monthAgo = new Date();
		monthAgo.setDate(now.getDate() - 30);

		const marketDemands = await this.repository.findManyByCriteria({
			where: {
				createdAt: this.service.buildDbDataFilter({ before: now, after: monthAgo })
			}
		}, this.repository.getRelations());

		const b = {};

		const map: Set<string> = marketDemands.reduce((set: any, md: MarketDemandEntity) => {
			const key = [
				md.production.feed.feedSegment.id,
				md.production.feed.feedTitle.id,
				md.production.feed.animalSpecies.id,
				md.ukraineRegion.id
			].join('_');

			if (!b[key]) {
				b[key] = 0;
			}
			b[key] += 1;

			return set.add(key);
		}, new Set());


		const mapArray = Array.from(map);
		const keys = Array.from(map.keys()).map(x => x.split('_').map(Number));
		const predictions = this.randomForest.predict(keys as any);

		const response: PredictionsResponse[] = Object.values(marketDemands.reduce((acc: any, md) => {
			const key = [
				md.production.feed.feedSegment.id,
				md.production.feed.feedTitle.id,
				md.production.feed.animalSpecies.id,
				md.ukraineRegion.id
			].join('_');

			if (!acc[key]) {
				acc[key] = {
					feedSegment: {
						id: md.production.feed.feedSegment.id,
						title: md.production.feed.feedSegment.title
					},
					feedTitle: {
						id: md.production.feed.feedTitle.id,
						title: md.production.feed.feedTitle.title
					},
					animalSpecies: {
						id: md.production.feed.animalSpecies.id,
						title: md.production.feed.animalSpecies.title
					},
					ukraineRegion: {
						id: md.ukraineRegion.id,
						title: md.ukraineRegion.title
					},
					prediction: predictions[mapArray.indexOf(key)]
				};
			}

			return acc;
		}, {}));
		return response;
	}

	@ResolveField('production', () => [ProductionEntity])
	async resolveProduction(@Parent() marketDemand: MarketDemandEntity): Promise<ProductionEntity[]> {
		return this.productionRepository.findManyByCriteria({
			where: {
				marketDemands: {
					id: marketDemand.id
				}
			}
		});
	}

	@ResolveField('ukraineRegion', () => [UkraineRegionEntity])
	async resolveUkraineRegion(@Parent() marketDemand: MarketDemandEntity): Promise<UkraineRegionEntity[]> {
		return this.ukraineRegionRepository.findManyByCriteria({
			where: {
				marketDemands: {
					id: marketDemand.id
				}
			}
		});
	}
}

@ObjectType()
export class ObjectValue {
	@Field(() => Int)
	id: number;

	@Field()
	title: string;
}

@ObjectType()
export class PredictionsResponse {
	@Field(() => ObjectValue)
	feedSegment: ObjectValue;

	@Field(() => ObjectValue)
	feedTitle: ObjectValue;

	@Field(() => ObjectValue)
	animalSpecies: ObjectValue;

	@Field(() => ObjectValue)
	ukraineRegion: ObjectValue;

	@Field(() => Int)
	prediction : number;
}
