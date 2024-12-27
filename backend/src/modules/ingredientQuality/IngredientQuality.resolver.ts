import { Resolver, Query, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { IngredientQualityEntity } from './IngredientQuality.entity';
import { IngredientQualityRepository } from './IngredientQuality.repository'
import { IngredientEntity } from '../ingredient/Ingredient.entity';
import { ProviderEntity } from '../provider/Provider.entity';
import { FeedSegmentEntity } from '../feedSegment/FeedSegment.entity';
import { IngredientRepository } from '../ingredient/Ingredient.repository';
import { ProviderRepository } from '../provider/Provider.repository';
import { FeedSegmentRepository } from '../feedSegment/FeedSegment.repository';
import { GetIngredientQualityQueryDto } from './dto/GetIngredientQualityQuery.dto';
import { Pagination } from '../../common/Pagination';
import { IngredientQualityService } from './IngredientQuality.service';
import { CreateIngredientQualityMutationDto } from './dto/CreateIngredientQualityMutation.dto';
import { EVENTS } from '../../common/Events';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => IngredientQualityEntity)
export class IngredientQualityResolver extends BaseResolver<IngredientQualityEntity> {
  constructor(
    service: IngredientQualityService,
    repository: IngredientQualityRepository,
    sseService: ServerSideEventsService,
    private readonly ingredientRepository: IngredientRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly feedSegmentRepository: FeedSegmentRepository,
  ) {
    super(service, repository, sseService);
  }

  @Query(() => [IngredientQualityEntity])
  async getIngredientQuality(
    @Args('filter', { nullable: true, type: () => GetIngredientQualityQueryDto })
    filter?: GetIngredientQualityQueryDto,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<IngredientQualityEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => IngredientQualityEntity)
  async createIngredientQuality(
    @Args('body', { nullable: false, type: () => CreateIngredientQualityMutationDto })
    body: CreateIngredientQualityMutationDto,
  ) {
    return super.create(body, EVENTS.INGREDIENT_QUALITY);
  }

  @Mutation(() => IngredientQualityEntity)
  async deleteIngredientQuality(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }

  @ResolveField('ingredient', () => [IngredientEntity])
  async resolveIngredient(@Parent() ingredientQuality: IngredientQualityEntity): Promise<IngredientEntity[]> {
    return this.ingredientRepository.findManyByCriteria({
      where: {
        ingredientQualities: {
          id: ingredientQuality.id
        }
      }
    });
  }

  @ResolveField('provider', () => [ProviderEntity])
  async resolveProvider(@Parent() ingredientQuality: IngredientQualityEntity): Promise<ProviderEntity[]> {
    return this.providerRepository.findManyByCriteria({
      where: {
        ingredientQualities: {
          id: ingredientQuality.id
        }
      }
    });
  }

  @ResolveField('feedSegment', () => [FeedSegmentEntity])
  async resolveFeedSegment(@Parent() ingredientQuality: IngredientQualityEntity): Promise<FeedSegmentEntity[]> {
    return this.feedSegmentRepository.findManyByCriteria({
      where: {
        ingredientQualities: {
          id: ingredientQuality.id
        }
      }
    });
  }
}
