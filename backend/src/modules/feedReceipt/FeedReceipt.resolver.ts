import { Resolver, Query, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { FeedReceiptRepository } from './FeedReceipt.repository';
import { FeedReceiptEntity } from './FeedReceipt.entity';
import { FeedRepository } from '../feed/Feed.repository';
import { IngredientRepository } from '../ingredient/Ingredient.repository';
import { FeedEntity } from '../feed/Feed.entity';
import { IngredientEntity } from '../ingredient/Ingredient.entity';
import { FeedReceiptService } from './FeedReceipt.service';
import { Pagination } from '../../common/Pagination';
import { GetFeedReceiptQueryFilter } from './dto/GetFeedReceiptQuery.filter';
import { CreateFeedReceiptMutationDto } from './dto/CreateFeedReceiptMutation.dto';
import { EVENTS } from '../../common/Events';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => FeedReceiptEntity)
export class FeedReceiptResolver extends BaseResolver<FeedReceiptEntity> {
  constructor(
    service: FeedReceiptService,
    repository: FeedReceiptRepository,
    sseService: ServerSideEventsService,
    private readonly feedRepository: FeedRepository,
    private readonly ingredientRepository: IngredientRepository,
  ) {
    super(service, repository, sseService);
  }

  @Query(() => [FeedReceiptEntity])
  async getFeedReceipts(
    @Args('filter', { nullable: true, type: () => GetFeedReceiptQueryFilter })
    filter?: GetFeedReceiptQueryFilter,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<FeedReceiptEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => FeedReceiptEntity)
  async createFeedReceipt(
    @Args('body', { nullable: false, type: () => CreateFeedReceiptMutationDto })
    body: CreateFeedReceiptMutationDto,
  ) {
    return super.create(body, EVENTS.FEED_RECEIPT);
  }

  @Mutation(() => FeedReceiptEntity)
  async deleteFeedReceipt(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }

  @ResolveField('feed', () => [FeedEntity])
  async resolveFeed(@Parent() feed: FeedReceiptEntity): Promise<FeedEntity[]> {
    return this.feedRepository.findManyByCriteria({
      where: {
        feedReceipts: {
          id: feed.id
        },
      },
    });
  }

  @ResolveField('ingredient', () => [IngredientEntity])
  async resolveIngredient(@Parent() feed: FeedReceiptEntity): Promise<IngredientEntity[]> {
    return this.ingredientRepository.findManyByCriteria({
      where: {
        feedReceipts: {
          id: feed.id
        },
      },
    });
  }
}