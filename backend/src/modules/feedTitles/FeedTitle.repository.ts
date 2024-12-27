import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FeedTitleEntity } from './FeedTitle.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class FeedTitleRepository extends BaseRepository<FeedTitleEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(FeedTitleEntity));
	}

	getRelations(): string[] {
		return [];
	}
}