import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { FeedTitleEntity } from './FeedTitle.entity';
import { FeedTitleRepository } from './FeedTitle.repository';
import { Pagination } from '../../common/Pagination';
import { GetFeedTitleQuery } from './dto/GetFeedQuery.filter';
import { FeedTitleService } from './FeedTitle.service';
import { CreateFeedTitleMutationDto } from './dto/CreateFeedTitleMutation.dto';
import { EVENTS } from '../../common/Events';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => FeedTitleEntity)
export class FeedTitleResolver extends BaseResolver<FeedTitleEntity> {
  constructor(
    service: FeedTitleService,
    repository: FeedTitleRepository,
    sseService: ServerSideEventsService,
    ) {
    super(service, repository, sseService);
  }

  @Query(() => [FeedTitleEntity])
  async getFeedTitles(
    @Args('filter', { nullable: true, type: () => GetFeedTitleQuery })
    filter?: GetFeedTitleQuery,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<FeedTitleEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => FeedTitleEntity)
  async createFeedTitle(
    @Args('body', { nullable: false, type: () => CreateFeedTitleMutationDto })
    body: CreateFeedTitleMutationDto,
  ) {
    return super.create(body, EVENTS.FEED_TITLE);
  }

  @Mutation(() => FeedTitleEntity)
  async deleteFeedTitle(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }
}
