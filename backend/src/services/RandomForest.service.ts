import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { RegressionRandomTree } from './lib';
import { MarketDemandRepository } from '../modules/marketDemand/MarketDemand.repository';
import { MarketDemandService } from '../modules/marketDemand/MarketDemand.service';
import { MarketDemandEntity } from '../modules/marketDemand/MarketDemand.entity';

@Injectable()
export class RandomForestService {
	private readonly randomForest: any;

	constructor(
		private readonly markedDemandRepository: MarketDemandRepository,
		private readonly markedDemandService: MarketDemandService,
	) {
		this.randomForest = new RegressionRandomTree(15, 10);
		this.trainLast30Days().then(() => {});
	}

	async trainLast30Days() {
		const now = new Date();

		const monthAgo = new Date();
		monthAgo.setDate(now.getDate() - 30);

		const marketDemands = await this.markedDemandRepository.findManyByCriteria({
			where: {
				createdAt: this.markedDemandService.buildDbDataFilter({ before: now, after: monthAgo }),
			},
		}, this.markedDemandRepository.getRelations());

		const {X, y} = this.parseData(marketDemands);

		this.train(X, y);
	}

	async trainThisMonth() {
		const now = new Date();

		const [currentYear, currentMonth] = [
			now.getFullYear(),
			now.getMonth(),
		];

		const after = new Date(currentYear, currentMonth, 1, 0, 0, 0);
		const before = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

		const marketDemands = await this.markedDemandRepository.findManyByCriteria({
			where: {
				createdAt: this.markedDemandService.buildDbDataFilter({ before, after }),
			},
		}, this.markedDemandRepository.getRelations());

		const {X, y} = this.parseData(marketDemands);

		this.train(X, y);
	}

	private parseData(marketDemands: MarketDemandEntity[]) {
		const map = marketDemands.reduce((acc: any, md: MarketDemandEntity) => {
			const key = [
				md.production.feed.feedSegment.id,
				md.production.feed.feedTitle.id,
				md.production.feed.animalSpecies.id,
				md.ukraineRegion.id,
			].join('_');

			if (!acc[key]) {
				acc[key] = 0;
			}
			acc[key] += 1;
			return acc;
		}, {});

		const X = [];
		const y = [];

		Object.keys(map).map((keysString: string) => {
			X.push(keysString.split('_').map(Number));
			y.push(map[keysString]);
		});

		return { X, y }
	}

	train(X: XData, y: YData) {
		const data = X.map((row, idx) => [...row, y[idx]]);
		this.randomForest.train(data);
	}

	predict(X: YData) {
		return this.randomForest.predict(X);
	}
}

type XData = [number, number, number, number][];
type YData = number[];