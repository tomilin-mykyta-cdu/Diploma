import {
	Between, FindOptionsWhere,
	LessThanOrEqual,
	MoreThanOrEqual
} from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Pagination } from '../common/Pagination';
import { NotImplementedException } from '@nestjs/common';

export class BaseService {
	public buildDbDataFilter({ after, before } : { after?: Date, before?: Date }) {
		if (before && after) {
			return Between(after, before);
		}

		if (before && !after) {
			return LessThanOrEqual(before);
		}

		if (!before && after) {
			return MoreThanOrEqual(after);
		}
	}

	public buildDbPagination(paginationObject?: Pagination): Pick<FindManyOptions, 'skip' | 'take'> {
		if (!paginationObject) {
			return null;
		}

		if (![
			paginationObject.page,
			paginationObject.pageSize,
		].every(x => x !== undefined)) {
			return null;
		}

		return {
			skip: paginationObject.page * paginationObject.pageSize,
			take: paginationObject.pageSize,
		};
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public buildWhereObject(filter?: any): FindOptionsWhere<any> {
		throw new NotImplementedException();
	}

	public buildFindManyOptions(options: { filter: FindOptionsWhere<any>, pagination?: Pagination }): FindManyOptions {
		const where = this.buildWhereObject(options.filter);
		const pagination = this.buildDbPagination(options.pagination);

		return {
			where,
			...pagination,
		}
	}
}