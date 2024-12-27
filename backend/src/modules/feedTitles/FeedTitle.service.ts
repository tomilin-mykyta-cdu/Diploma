import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { FeedTitleEntity } from './FeedTitle.entity';
import { FeedTitleSearchable } from './dto/FeedTitle.searchable';
import { GetFeedTitleQuery } from './dto/GetFeedQuery.filter';

@Injectable()
export class FeedTitleService extends BaseService {
  constructor() {
    super()
  }

  public buildWhereObject(filter?: GetFeedTitleQuery): FindOptionsWhere<FeedTitleEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<FeedTitleEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));
    return where;
  }

  public applyFieldsFilter(filter: FeedTitleSearchable): FindOptionsWhere<FeedTitleEntity> | undefined {
    if (![
      filter.id,
      filter.title,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<FeedTitleEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    return where;
  }
}
