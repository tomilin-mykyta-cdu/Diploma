import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { FeedReceiptEntity } from './FeedReceipt.entity';
import { FeedReceiptSearchable } from './dto/FeedReceipt.searchable';
import { IngredientService } from '../ingredient/Ingredient.service';
import { FeedService } from '../feed/Feed.service';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { AnimalSpeciesService } from '../AnimalSpecies/AnimalSpecies.service';
import { GetFeedReceiptQueryFilter } from './dto/GetFeedReceiptQuery.filter';
import { FeedTitleService } from '../feedTitles/FeedTitle.service';

@Injectable()
export class FeedReceiptService extends BaseService {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly feedService: FeedService,
    private readonly feedSegmentService: FeedSegmentService,
    private readonly animalSpeciesService: AnimalSpeciesService,
    private readonly feedTitleService: FeedTitleService,
  ) {
    super()
  }

  public buildWhereObject(filter?: GetFeedReceiptQueryFilter): FindOptionsWhere<FeedReceiptEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<FeedReceiptEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));
    mutateObjectIfExists(
      where.ingredient = {},
      this.ingredientService.applyFieldsFilter({
        id: filter.ingredientId,
        title: filter.ingredientTitle,
      }),
    );
    mutateObjectIfExists(
      where.feed = {},
      this.feedService.applyFieldsFilter({
        id: filter.feedId,
      }),
    );
    mutateObjectIfExists(
      where.feed = {},
      this.feedTitleService.applyFieldsFilter({
        title: filter.feedTitle,
      }),
    );
    mutateObjectIfExists(
      where.feed.feedSegment = {},
      this.feedSegmentService.applyFieldsFilter({
        id: filter.feedSegmentId,
        title: filter.feedSegmentTitle,
      }),
    );
    mutateObjectIfExists(
      where.feed.animalSpecies = {},
      this.animalSpeciesService.applyFieldsFilter({
        id: filter.animalSpeciesId,
        title: filter.animalSpeciesTitle,
      }),
    );

    return where;
  }

  public applyFieldsFilter(filter: FeedReceiptSearchable): FindOptionsWhere<FeedReceiptEntity> | undefined {
    if (![
      filter.id,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<FeedReceiptEntity> = {};
    if (filter.id) { where.id = filter.id; }

    return where;
  }
}
