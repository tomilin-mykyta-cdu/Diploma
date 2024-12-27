import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { FeedEntity } from './Feed.entity';
import { FeedSearchable } from './dto/Feed.searchable';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { GetFeedQuery } from './dto/GetFeedQuery.filter';
import { AnimalSpeciesService } from '../AnimalSpecies/AnimalSpecies.service';
import { FeedTitleService } from '../feedTitles/FeedTitle.service';

@Injectable()
export class FeedService extends BaseService {
  constructor(
    @Inject(forwardRef(() => AnimalSpeciesService))
    private readonly animalSpeciesService: AnimalSpeciesService,
    private readonly feedSegmentService: FeedSegmentService,
    private readonly feedTitleService: FeedTitleService,
  ) {
    super()
  }

  public buildWhereObject(filter?: GetFeedQuery): FindOptionsWhere<FeedEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<FeedEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    mutateObjectIfExists(
      where.feedTitle = {},
      this.feedTitleService.applyFieldsFilter({
        title: filter.feedTitle,
      })
    );

    mutateObjectIfExists(
      where.feedSegment = {},
      this.feedSegmentService.applyFieldsFilter({
        id: filter.feedSegmentId,
        title: filter.feedSegmentTitle,
      })
    );

    mutateObjectIfExists(
      where.animalSpecies = {},
      this.animalSpeciesService.applyFieldsFilter({
        id: filter.animalSpeciesId,
        title: filter.animalSpeciesTitle,
      }),
    );

    return where;
  }

  public applyFieldsFilter(filter: FeedSearchable): FindOptionsWhere<FeedEntity> | undefined {
    if (![
      filter.id,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<FeedEntity> = {};
    if (filter.id) { where.id = filter.id; }

    return where;
  }
}
