import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FeedReceiptEntity } from './FeedReceipt.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class FeedReceiptRepository extends BaseRepository<FeedReceiptEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(FeedReceiptEntity));
	}

	getRelations(): string[] {
		return [
			'ingredient',
			'feed',
			'feed.feedTitle',
			'feed.animalSpecies',
			'feed.feedSegment',
		];
	}
}