import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IngredientEntity } from './Ingredient.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class IngredientRepository extends BaseRepository<IngredientEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(IngredientEntity));
	}

	getRelations(): string[] {
		return [];
	}
}