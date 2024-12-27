import { Resolver, Query, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { ProductionRepository } from './Production.repository';
import { ProductionEntity } from './Production.entity';
import { FeedEntity } from '../feed/Feed.entity';
import { FeedRepository } from '../feed/Feed.repository';
import { Pagination } from '../../common/Pagination';
import { ProductionService } from './Production.service';
import { GetProductionQueryDto } from './dto/GetProductionQuery.dto';
import { CreateProductionMutationDto } from './dto/CreateProductionMutation.dto';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => ProductionEntity)
export class ProductionResolver extends BaseResolver<ProductionEntity> {
  constructor(
    service: ProductionService,
    repository: ProductionRepository,
    sseService: ServerSideEventsService,
    private readonly feedRepository: FeedRepository,
    ) {
    super(service, repository, sseService);
  }

  @Query(() => [ProductionEntity])
  async getProductions(
      @Args('filter', { nullable: true, type: () => GetProductionQueryDto })
      filter?: GetProductionQueryDto,
      @Args('pagination', { nullable: true, type: () => Pagination })
      pagination?: Pagination,
  ): Promise<ProductionEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => ProductionEntity)
  async createProduction(
    @Args('body', { nullable: false, type: () => CreateProductionMutationDto })
    body: CreateProductionMutationDto,
  ) {
    return super.create(body, EVENTS.PRODUCTION);
  }

  @Mutation(() => ProductionEntity)
  async deleteProduction(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }

  @ResolveField('feed', () => FeedEntity)
  async resolveFeedSegment(@Parent() production: ProductionEntity): Promise<FeedEntity> {
    return this.feedRepository.findOneByCriteria({
        productions: {
          id: production.id
        }
    });
  }
}
