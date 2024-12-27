import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { ProviderSearchable } from './dto/Provider.searchable';
import { BaseService } from '../../hz/Base.service';
import { ProviderEntity } from './Provider.entity';
import { GetProviderQueryDto } from './dto/GetProviderQuery.dto';

@Injectable()
export class ProviderService extends BaseService {
  constructor() {
    super()
  }

  public buildWhereObject(filter?: GetProviderQueryDto): FindOptionsWhere<ProviderEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<ProviderEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    return where;
  }

  public applyFieldsFilter(filter: ProviderSearchable): FindOptionsWhere<ProviderEntity> | undefined {
    if (![
      filter.id,
      filter.title,
      filter.createdAfter,
      filter.createdBefore,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<ProviderEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    if (filter.createdBefore || filter.createdAfter) {
      where.createdAt = this.buildDbDataFilter({
        after: filter.createdAfter,
        before: filter.createdBefore,
      });
    }

    return where;
  }
}
