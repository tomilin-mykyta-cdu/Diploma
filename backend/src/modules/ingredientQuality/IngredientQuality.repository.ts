import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IngredientQualityEntity } from './IngredientQuality.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class IngredientQualityRepository extends BaseRepository<IngredientQualityEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(IngredientQualityEntity));
	}

	getRelations(): string[] {
		return [
			'ingredient',
			'provider',
			'feedSegment',
		];
	}
}