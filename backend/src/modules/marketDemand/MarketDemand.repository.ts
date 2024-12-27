import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MarketDemandEntity } from './MarketDemand.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class MarketDemandRepository extends BaseRepository<MarketDemandEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(MarketDemandEntity));
	}

	getRelations(): string[] {
		return [
			'production',
			'production.feed',
			'production.feed.feedTitle',
			'production.feed.animalSpecies',
			'production.feed.feedSegment',
			'ukraineRegion'
		]
	}
}