import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { AnimalSpeciesEntity } from './AnimalSpecies.entity';
import { GetAnimalSpeciesQuery } from './dto/GetAnimalSpeciesQuery.filter';
import { BaseService } from '../../hz/Base.service';
import { AnimalSpeciesSearchable } from './dto/AnimalSpecies.searchable';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { FeedService } from '../feed/Feed.service';
import { FeedTitleService } from '../feedTitles/FeedTitle.service';

@Injectable()
export class AnimalSpeciesService extends BaseService {
  constructor(
    private readonly feedService: FeedService,
    private readonly feedTitleService: FeedTitleService,
  ) {
    super()
  }

  public buildWhereObject(filter?: GetAnimalSpeciesQuery): FindOptionsWhere<AnimalSpeciesEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<AnimalSpeciesEntity> = {};

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

    return where;
  }

  public applyFieldsFilter(filter: AnimalSpeciesSearchable): FindOptionsWhere<AnimalSpeciesEntity> | undefined {
    if (![
      filter.id,
      filter.title
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<AnimalSpeciesEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    return where;
  }
}
