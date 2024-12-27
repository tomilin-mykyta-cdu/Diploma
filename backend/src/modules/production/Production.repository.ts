import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductionEntity } from './Production.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class ProductionRepository extends BaseRepository<ProductionEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(ProductionEntity));
	}

	getRelations(): string[] {
		return [
			'feed',
			'feed.feedTitle',
			'feed.animalSpecies',
			'feed.feedSegment',
		];
	}
}