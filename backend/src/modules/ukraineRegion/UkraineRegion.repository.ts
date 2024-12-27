import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UkraineRegionEntity } from './UkraineRegion.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class UkraineRegionRepository extends BaseRepository<UkraineRegionEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(UkraineRegionEntity));
	}

	getRelations(): string[] {
		return [];
	}
}