import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { FeedSegmentEntity } from './FeedSegment.entity';
import { FeedSegmentSearchable } from './dto/FeedSegment.searchable';
import { GetFeedSegmentQueryDto } from './dto/GetFeedSegmentQuery.dto';

@Injectable()
export class FeedSegmentService extends BaseService {
  constructor() {
    super()
  }

  public buildWhereObject(filter?: GetFeedSegmentQueryDto): FindOptionsWhere<FeedSegmentEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<FeedSegmentEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    return where;
  }

  public applyFieldsFilter(filter: FeedSegmentSearchable): FindOptionsWhere<FeedSegmentEntity> | undefined {
    if (![
      filter.id,
      filter.title,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<FeedSegmentEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    return where;
  }
}
