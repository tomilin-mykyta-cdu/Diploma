import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AnimalSpeciesEntity } from './AnimalSpecies.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class AnimalSpeciesRepository extends BaseRepository<AnimalSpeciesEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(AnimalSpeciesEntity));
	}

	getRelations(): string[] {
		return [];
	}
}