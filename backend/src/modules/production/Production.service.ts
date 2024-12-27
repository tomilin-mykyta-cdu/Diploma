import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { ProductionEntity } from './Production.entity';
import { ProductionSearchable } from './dto/Production.searchable';
import { GetProductionQueryDto } from './dto/GetProductionQuery.dto';
import { FeedService } from '../feed/Feed.service';
import { AnimalSpeciesService } from '../AnimalSpecies/AnimalSpecies.service';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { FeedTitleService } from '../feedTitles/FeedTitle.service';

@Injectable()
export class ProductionService extends BaseService {
  constructor(
      private readonly feedService: FeedService,
      private readonly animalSpeciesService: AnimalSpeciesService,
      private readonly feedSegmentService: FeedSegmentService,
      private readonly feedTitleService: FeedTitleService,
  ) {
    super()
  }

  public buildWhereObject(filter?: GetProductionQueryDto): FindOptionsWhere<ProductionEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<ProductionEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));
    mutateObjectIfExists(
        where.feed = {},
        this.feedService.applyFieldsFilter({
          id: filter.feedId,
        }),
    );
    mutateObjectIfExists(
      where.feed.feedTitle = {},
      this.feedTitleService.applyFieldsFilter({
        title: filter.feedTitle,
      }),
    );
    mutateObjectIfExists(
        where.feed.animalSpecies = {},
        this.animalSpeciesService.applyFieldsFilter({
          id: filter.animalSpeciesId,
          title: filter.animalSpeciesTitle,
        }),
    );
    mutateObjectIfExists(
        where.feed.feedSegment = {},
        this.feedSegmentService.applyFieldsFilter({
          id: filter.feedSegmentId,
          title: filter.feedSegmentTitle,
        }),
    );

    return where;
  }

  public applyFieldsFilter(filter: ProductionSearchable): FindOptionsWhere<ProductionEntity> | undefined {
    if (![
      filter.id,
      filter.createdAfter,
      filter.createdBefore,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<ProductionEntity> = {};
    if (filter.id) { where.id = filter.id; }

    if (filter.createdBefore || filter.createdAfter) {
      where.createdAt = this.buildDbDataFilter({
        after: filter.createdAfter,
        before: filter.createdBefore,
      });
    }

    return where;
  }
}
