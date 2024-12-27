import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { MarketDemandRepository } from '../modules/marketDemand/MarketDemand.repository';
import { UkraineRegionRepository } from '../modules/ukraineRegion/UkraineRegion.repository';
import { ProductionRepository } from '../modules/production/Production.repository';
import { getIntegerBetween } from '../infrastructure/TypeOrm.module';
import { ServerSideEventsService } from '../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../common/Events';
import { MarketDemandService } from '../modules/marketDemand/MarketDemand.service';
import { RandomForestService } from '../services/RandomForest.service';
import { MarketDemandEntity } from '../modules/marketDemand/MarketDemand.entity';
import { PredictionsResponse } from '../modules/marketDemand/MarketDemand.resolver';

type PresentationDomains = 'animalSpecies' | 'ukraineRegion' | 'feedSegment' | 'feedTitle'
type PresentationDomainObject = Record<string, number>;

type PresentationObjectType = Record<PresentationDomains, PresentationDomainObject>;


export const PRESENTATION_OBJECT: PresentationObjectType = {
	animalSpecies: {},
	ukraineRegion: {},
	feedSegment: {},
	feedTitle: {}
};

type MarketDemandYear = Record<number, number[]>;

const marketDemandYear: MarketDemandYear = {
	2024: [],
};

@Controller('presentation')
export class PresentationController {
	constructor(
		private readonly marketDemandRepository: MarketDemandRepository,
		private readonly marketDemandService: MarketDemandService,
		private readonly productionRepository: ProductionRepository,
		private readonly ukraineRegionRepository: UkraineRegionRepository,
		private readonly sseService: ServerSideEventsService,
		private readonly randomForest: RandomForestService
	) {
		this.initFullStatistics();
	}

	public static initPresentationObject(key: PresentationDomains, values: string[]): void {
		values.forEach((value) => {
			PRESENTATION_OBJECT[key][value] = 1;
		});
	}

	private getRandomTimestampForMonth(month: number, passedYear?: number): Date {
		if (month < 1 || month > 12) {
			throw new Error('Month must be between 1 and 12.');
		}

		const year = passedYear ?? new Date().getFullYear(); // Use the current year

		// Get the start and end dates of the month
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 0); // Day 0 of the next month gives the last day of the current month

		// Calculate random timestamp within the range
		const startTimestamp = startDate.getTime();
		const endTimestamp = endDate.getTime();
		const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp;

		return new Date(randomTimestamp);
	}

	private pickRandomByWeight(): Record<string, string> {
		const result: Record<string, string> = {};

		for (const domain in PRESENTATION_OBJECT) {
			const items = PRESENTATION_OBJECT[domain];
			let totalWeight = 0;

			// Calculate the total weight
			for (const key in items) {
				totalWeight += items[key];
			}

			// Generate a random number within the total weight range
			const randomWeight = Math.random() * totalWeight;
			let cumulativeWeight = 0;

			// Find the item corresponding to the random weight
			for (const key in items) {
				cumulativeWeight += items[key];
				if (randomWeight < cumulativeWeight) {
					result[domain] = key;
					break;
				}
			}
		}

		return result;
	}

	private async initFullStatistics() {
		for (let i = 0; i < 12; i+= 1) {
			const startDate = new Date(2024, i, 1);
			const endDate = new Date(2024, i + 1, 0);

			this.marketDemandRepository.findManyCountByCriteria({
				where: {
					createdAt: this.marketDemandService.buildDbDataFilter({
						after: startDate,
						before: endDate,
					})
				}
			})
				.then((marketDemandsCount) => {
					marketDemandYear[2024][i] = marketDemandsCount;
				})
		}
	}

	@Get('/')
	public getPresentationObject() {
		return { PRESENTATION_OBJECT, marketDemandYear };
	}

	@Patch('')
	public updateKey(@Body() body: { domain: PresentationDomains; key: string; value: number }) {
		PRESENTATION_OBJECT[body.domain][body.key] = +body.value;
	}

	@Post('')
	public async generate(@Body() body: { month: number; amount: number, year?: number }) {
		const objects: Record<PresentationDomains, string>[] = [];
		for (let i = 0; i < body.amount; i++) {
			objects.push(this.pickRandomByWeight());
		}

		const productionEntitiesPromises = objects.map((object) => {
			return this.productionRepository.findOneByCriteria({
				feed: {
					feedTitle: { title: object.feedTitle },
					feedSegment: { title: object.feedSegment },
					animalSpecies: { title: object.animalSpecies }
				}
			}, this.productionRepository.getRelations());
		});

		const ukraineRegionEntities = objects.map((object) => {
			return this.ukraineRegionRepository.findOneByCriteria({ title: object.ukraineRegion });
		});

		const ukraineRegions = await Promise.all(ukraineRegionEntities);
		const productEntities = await Promise.all(productionEntitiesPromises);

		const newMarketDemands = productEntities.map((x, index) => {
			return {
				production: x,
				ukraineRegion: ukraineRegions[index],
				price: getIntegerBetween(1000, 3000),
				createdAt: this.getRandomTimestampForMonth(body.month, body.year ?? 2024)
			};
		});

		const created = await this.marketDemandRepository.createMany(newMarketDemands);
		created.forEach((md) => this.sseService.emitEvent(EVENTS.MARKET_DEMAND, md));
		await this.randomForest.trainThisMonth();
		const predictions = await this.getPredictions();
		this.sseService.emitEvent(EVENTS.TRAIN_PREDICTION_MODEL, predictions);
	}

	async getPredictions(): Promise<PredictionsResponse[]> {
		const now = new Date();

		const monthAgo = new Date();
		monthAgo.setDate(now.getDate() - 30);

		const marketDemands = await this.marketDemandRepository.findManyByCriteria({
			where: {
				createdAt: this.marketDemandService.buildDbDataFilter({ before: now, after: monthAgo })
			}
		}, this.marketDemandRepository.getRelations());

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
}


