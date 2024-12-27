import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FeedEntity } from './Feed.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class FeedRepository extends BaseRepository<FeedEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(FeedEntity));
	}

	getRelations(): string[] {
		return [
			'animalSpecies',
			'feedSegment',
			'feedTitle',
		];
	}
}