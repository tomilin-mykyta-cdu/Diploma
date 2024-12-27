import { FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../hz/Base.entity';

export function mutateObjectIfExists<T extends BaseEntity>(
	whereObject: FindOptionsWhere<T>,
	partialWhere: FindOptionsWhere<T> = {},
) {
	if (partialWhere) {
		Object.assign(whereObject, partialWhere);
	}
}