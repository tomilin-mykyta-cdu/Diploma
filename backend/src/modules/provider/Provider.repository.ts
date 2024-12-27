import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProviderEntity } from './Provider.entity';
import { BaseRepository } from '../../hz/Base.repository';

@Injectable()
export class ProviderRepository extends BaseRepository<ProviderEntity> {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {
		super(dataSource.getRepository(ProviderEntity));
	}

	getRelations(): string[] {
		return [];
	}
}