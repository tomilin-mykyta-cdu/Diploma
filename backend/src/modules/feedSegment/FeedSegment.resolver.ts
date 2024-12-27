import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { FeedSegmentEntity } from './FeedSegment.entity';
import { FeedSegmentRepository } from './FeedSegment.repository';
import { Pagination } from '../../common/Pagination';
import { FeedSegmentService } from './FeedSegment.service';
import { GetFeedSegmentQueryDto } from './dto/GetFeedSegmentQuery.dto';
import { CreateFeedSegmentMutationDto } from './dto/CreateFeedSegmentMutation.dto';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => FeedSegmentEntity)
export class FeedSegmentResolver extends BaseResolver<FeedSegmentEntity> {
  constructor(
    service: FeedSegmentService,
    repository: FeedSegmentRepository,
    sseService: ServerSideEventsService,
  ) {
    super(service, repository, sseService);
  }

  @Query(() => [FeedSegmentEntity])
  async getFeedSegments(
    @Args('filter', { nullable: true, type: () => GetFeedSegmentQueryDto })
    filter?: GetFeedSegmentQueryDto,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<FeedSegmentEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => FeedSegmentEntity)
  async createFeedSegment(
    @Args('body', { nullable: false, type: () => CreateFeedSegmentMutationDto })
    body: CreateFeedSegmentMutationDto,
  ) {
    return super.create(body, EVENTS.FEED_SEGMENT);
  }

  @Mutation(() => FeedSegmentEntity)
  async deleteFeedSegment(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }
}