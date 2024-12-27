import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { IngredientEntity } from './Ingredient.entity';
import { IngredientRepository } from './Ingredient.repository';
import { Pagination } from '../../common/Pagination';
import { IngredientService } from './Ingredient.service';
import { GetIngredientQueryDto } from './dto/GetIngredientQuery.dto';
import { CreateIngredientMutationDto } from './dto/CreateIngredientMutation.dto';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => IngredientEntity)
export class IngredientResolver extends BaseResolver<IngredientEntity> {
  constructor(
    service: IngredientService,
    repository: IngredientRepository,
    sseService: ServerSideEventsService,
    ) {
    super(service, repository, sseService);
  }

  @Query(() => [IngredientEntity])
  async getIngredients(
    @Args('filter', { nullable: true, type: () => GetIngredientQueryDto })
    filter?: GetIngredientQueryDto,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<IngredientEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => IngredientEntity)
  async createIngredient(
    @Args('body', { nullable: false, type: () => CreateIngredientMutationDto })
    body: CreateIngredientMutationDto,
  ) {
    return super.create(body, EVENTS.INGREDIENT);
  }

  @Mutation(() => IngredientEntity)
  async deleteIngredient(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }
}