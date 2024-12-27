import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UkraineRegionEntity } from './UkraineRegion.entity';
import { UkraineRegionRepository } from './UkraineRegion.repository';
import { Pagination } from '../../common/Pagination';
import { UkraineRegionService } from './UkraineRegion.service';
import { GetUkraineRegionQueryDto } from './dto/GetUkraineRegionQuery.dto';
import { CreateUkraineRegionMutationDto } from './dto/CreateUkraineRegionMutation.dto';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => UkraineRegionEntity)
export class UkraineRegionResolver extends BaseResolver<UkraineRegionEntity> {
  constructor(
    service: UkraineRegionService,
    repository: UkraineRegionRepository,
    sseService: ServerSideEventsService,
  ) {
    super(service, repository, sseService);
  }

  @Query(() => [UkraineRegionEntity])
  async getUkraineRegions(
    @Args('filter', { nullable: true, type: () => GetUkraineRegionQueryDto })
    filter?: GetUkraineRegionQueryDto,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<UkraineRegionEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => UkraineRegionEntity)
  async createUkraineRegion(
    @Args('body', { nullable: false, type: () => CreateUkraineRegionMutationDto })
    body: CreateUkraineRegionMutationDto,
  ) {
    return super.create(body, EVENTS.UKRAINE_REGION);
  }

  @Mutation(() => UkraineRegionEntity)
  async deleteUkraineRegion(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }
}
