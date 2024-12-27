import { Repository } from 'typeorm/repository/Repository';
import { BaseEntity } from './Base.entity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { FindOptionsWhere, In } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export class BaseRepository<Entity extends BaseEntity, ID = Entity['id']> {
	constructor(protected readonly repository: Repository<Entity>) {
	}

	getRelations(): string[]  {
		throw new Error('Not implemented');
	}

	create<T extends keyof Entity>(entity: Omit<Entity, keyof BaseEntity | T>): Promise<Entity> {
		return this.repository.save(entity as Entity);
	}

	createMany<T extends keyof Entity>(entity: Omit<Entity, keyof BaseEntity | T>[]): Promise<Entity[]> {
		return this.repository.save(entity as Entity[]);
	}

	findOneById(id: Entity['id']): Promise<Entity | undefined> {
		return this.repository.findOneBy({ id, deleted: false } as FindOptionsWhere<Entity>);
	}

	findOneByCriteria(where: FindOptionsWhere<Entity>, relations = []): Promise<Entity | undefined> {
		return this.repository.findOne({ where: {
				deleted: false,
				...where,
			},
			// @ts-ignore
			order: { createdAt: 'DESC' },
			relations,
		});
	}

	findManyByIds(ids: ID[]): Promise<Entity[]> {
		return this.repository.findBy({
			id: In(ids)
		} as FindOptionsWhere<Entity>);
	}

	findManyByCriteria(options: FindManyOptions<Entity>, polulate: string[] = []): Promise<Entity[]> {
		if (!options.where) {
			options.where = {};
		}
		if (options.where['deleted'] === undefined) {
			options.where['deleted'] = false;
		}
		options.relations = polulate;
		// @ts-ignore
		options.order = { createdAt: 'DESC' };
		return this.repository.find(options);
	}

	findManyCountByCriteria(options: FindManyOptions<Entity>, polulate: string[] = []): Promise<number> {
		if (!options.where) {
			options.where = {};
		}
		if (options.where['deleted'] === undefined) {
			options.where['deleted'] = false;
		}
		options.relations = polulate;
		// @ts-ignore
		options.order = { createdAt: 'DESC' };
		return this.repository.count(options);
	}

	findAll(): Promise<Entity[]> {
		return this.repository.find();
	}

	updateOneById(id: ID, data: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
		return this.repository.update({ id } as FindOptionsWhere<Entity>, data);
	}

	updateManyByIds(ids: ID[], data: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
		return this.repository.update({
			id: In(ids)
		} as FindOptionsWhere<Entity>, data);
	}

	updateManyByCriteria(where: FindOptionsWhere<Entity>, data: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
		return this.repository.update(where, data);
	}

	async deleteOne(id: ID): Promise<boolean> {
		const result = await this.repository.update(id as FindOptionsWhere<Entity>, {
			deleted: true
		} as unknown as QueryDeepPartialEntity<Entity>);
		return result.affected === 1;
	}

	deleteManyByIds(ids: ID[]): Promise<UpdateResult> {
		return this.repository.update({
			id: In(ids)
		} as FindOptionsWhere<Entity>, {
			deleted: true
		} as unknown as QueryDeepPartialEntity<Entity>);
	}

	deleteManyByCriteria(where: FindOptionsWhere<Entity>): Promise<UpdateResult> {
		return this.repository.update(
			{
				deleted: false,
				...where,
			}, {
			deleted: true
		} as unknown as QueryDeepPartialEntity<Entity>);
	}
}