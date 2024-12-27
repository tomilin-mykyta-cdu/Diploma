import { BaseEntity } from './Base.entity';
import { BaseService } from './Base.service';
import { BaseRepository } from './Base.repository';
import { ServerSideEventsService } from '../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { Pagination } from '../common/Pagination';
import { EVENTS } from '../common/Events';
import { FindOptionsWhere } from 'typeorm';

export class BaseResolver<T extends BaseEntity> {
	constructor(
		protected readonly service: BaseService,
		protected readonly repository: BaseRepository<T>,
		protected readonly sseService: ServerSideEventsService,
	) {}

	async get(filter?: Record<string, any>, pagination?: Pagination): Promise<T[]> {
		return this.repository.findManyByCriteria(this.service.buildFindManyOptions({ filter, pagination }));
	}

	async create(body: any, eventKey: typeof EVENTS[keyof typeof EVENTS]): Promise<T> {
		const created = await this.repository.create(body);

		const entity = await this.repository.findOneByCriteria({ id: created.id } as FindOptionsWhere<any>,
			this.repository.getRelations(),
		);
		this.sseService.emitEvent(eventKey, entity);
		return entity;
	}

	async delete(id: T['id']): Promise<boolean> {
		return this.repository.deleteOne(id);
	}
}

