import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FeedSegmentEntity } from './FeedSegment.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class FeedSegmentRepository extends BaseRepository<FeedSegmentEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(FeedSegmentEntity));
	}

	getRelations(): string[] {
		return [];
	}
}