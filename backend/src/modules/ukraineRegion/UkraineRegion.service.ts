import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { UkraineRegionEntity } from './UkraineRegion.entity';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { UkraineRegionSearchable } from './dto/UkraineRegion.searchable';
import { GetUkraineRegionQueryDto } from './dto/GetUkraineRegionQuery.dto';
import { BaseService } from '../../hz/Base.service';

@Injectable()
export class UkraineRegionService extends BaseService {
  constructor() {
    super();
  }

  public buildWhereObject(filter?: GetUkraineRegionQueryDto): FindOptionsWhere<UkraineRegionEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<UkraineRegionEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    return where;
  }

  public applyFieldsFilter(filter: UkraineRegionSearchable): FindOptionsWhere<UkraineRegionEntity> | undefined {
    if (![
      filter.id,
      filter.title
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<UkraineRegionEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    return where;
  }
}
