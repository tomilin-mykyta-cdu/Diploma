import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { BaseService } from '../../hz/Base.service';
import { IngredientQualityEntity } from './IngredientQuality.entity';
import { IngredientQualitySearchable } from './dto/IngredientQuality.searchable';
import { IngredientService } from '../ingredient/Ingredient.service';
import { ProviderService } from '../provider/Provider.service';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { GetIngredientQualityQueryDto } from './dto/GetIngredientQualityQuery.dto';

@Injectable()
export class IngredientQualityService extends BaseService {
  constructor(
      private readonly ingredientService: IngredientService,
      private readonly providerService: ProviderService,
      private readonly feedSegmentService: FeedSegmentService,
  ) {
    super()
  }

  public buildWhereObject(filter?: GetIngredientQualityQueryDto): FindOptionsWhere<IngredientQualityEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<IngredientQualityEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));
    mutateObjectIfExists(
        where.ingredient = {},
        this.ingredientService.applyFieldsFilter({
          id: filter.ingredientId,
          title: filter.ingredientTitle,
        }),
    );
    mutateObjectIfExists(
        where.provider = {},
        this.providerService.applyFieldsFilter({
          id: filter.providerId,
          title: filter.providerTitle
        })
    );
    mutateObjectIfExists(
        where.feedSegment = {},
        this.feedSegmentService.applyFieldsFilter({
          id: filter.feedSegmentId,
          title: filter.feedSegmentTitle,
        })
    );

    return where;
  }

  public applyFieldsFilter(filter: IngredientQualitySearchable): FindOptionsWhere<IngredientQualityEntity> | undefined {
    if (![
      filter.id,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<IngredientQualityEntity> = {};
    if (filter.id) { where.id = filter.id; }

    return where;
  }
}
