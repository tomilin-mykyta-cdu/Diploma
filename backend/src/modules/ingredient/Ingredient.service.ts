import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { mutateObjectIfExists } from '../../common/Object.mutate';
import { IngredientSearchable } from './dto/Ingredient.searchable';
import { BaseService } from '../../hz/Base.service';
import { IngredientEntity } from './Ingredient.entity';
import { GetIngredientQueryDto } from './dto/GetIngredientQuery.dto';

@Injectable()
export class IngredientService extends BaseService {
  constructor() {
    super()
  }

  public buildWhereObject(filter?: GetIngredientQueryDto): FindOptionsWhere<IngredientEntity> {
    if (!filter) {
      return {};
    }

    const where: FindOptionsWhere<IngredientEntity> = {};

    mutateObjectIfExists(where, this.applyFieldsFilter(filter));

    return where;
  }

  public applyFieldsFilter(filter: IngredientSearchable): FindOptionsWhere<IngredientEntity> | undefined {
    if (![
      filter.id,
      filter.title,
    ].some(Boolean)) {
      return undefined;
    }

    const where: FindOptionsWhere<IngredientEntity> = {};
    if (filter.id) { where.id = filter.id; }
    if (filter?.title.length) { where.title = In(filter.title); }

    return where;
  }
}
