import { MarketDemandEntity } from './MarketDemand.entity';
import { Injectable } from '@nestjs/common';
import { GetMarketDemandDto } from './dto/GetMarketDemand.dto';
import { FindOptionsWhere } from 'typeorm';

import { mutateObjectIfExists } from '../../common/Object.mutate';
import { UkraineRegionService } from '../ukraineRegion/UkraineRegion.service';
import { BaseService } from '../../hz/Base.service';
import { MarketDemandSearchable } from './dto/MarketDemand.searchable';
import { ProductionService } from '../production/Production.service';
import { FeedService } from '../feed/Feed.service';
import { AnimalSpeciesService } from '../AnimalSpecies/AnimalSpecies.service';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { FeedTitleService } from '../feedTitles/FeedTitle.service';

@Injectable()
export class MarketDemandService extends BaseService {
  constructor(
    private readonly ukraineRegionService: UkraineRegionService,
    private readonly productionService: ProductionService,
    private readonly feedService: FeedService,
    private readonly animalSpecieService: AnimalSpeciesService,
    private readonly feedSegmentService: FeedSegmentService,
    private readonly feedTitleService: FeedTitleService,
  ) {
    super();
  }

  public buildWhereObject(filter?: GetMarketDemandDto): FindOptionsWhere<MarketDemandEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<MarketDemandEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    mutateObjectIfExists(
      where.ukraineRegion = {},
      this.ukraineRegionService.applyFieldsFilter({
        title: filter.ukraineRegionTitle,
      }),
    );

    mutateObjectIfExists(
      where.production = {},
      this.productionService.applyFieldsFilter({
        id: filter.productionId,
        createdBefore: filter.productionCreatedBefore,
        createdAfter: filter.productionCreatedAfter,
      }),
    );

    mutateObjectIfExists(
      where.production.feed = {},
      this.feedService.applyFieldsFilter({
        id: filter.feedId,
      }),
    );


    mutateObjectIfExists(
      where.production.feed.feedTitle = {},
      this.feedTitleService.applyFieldsFilter({
        title: filter.feedTitle,
      }),
    );

    mutateObjectIfExists(
      where.production.feed.animalSpecies = {},
      this.animalSpecieService.applyFieldsFilter({
        id: filter.animalSpeciesId,
        title: filter.animalSpeciesTitle,
      }),
    );

    mutateObjectIfExists(
      where.production.feed.feedSegment = {},
      this.feedSegmentService.applyFieldsFilter({
        id: filter.feedSegmentId,
        title: filter.feedSegmentTitle,
      }),
    );

    return where;
  }

  public applyFieldsFilter(filter: MarketDemandSearchable): FindOptionsWhere<MarketDemandEntity> | undefined {
    if (![filter.id, filter.createdAfter, filter.createdBefore].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<MarketDemandEntity> = {};
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
