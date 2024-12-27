import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProviderRepository } from './Provider.repository';
import { ProviderEntity } from './Provider.entity';
import { ProviderService } from './Provider.service';
import { Pagination } from '../../common/Pagination';
import { GetProviderQueryDto } from './dto/GetProviderQuery.dto';
import { CreateProviderMutationDto } from './dto/CreateProviderMutation.dto';
import { EVENTS } from '../../common/Events';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => ProviderEntity)
export class ProviderResolver extends BaseResolver<ProviderEntity> {
  constructor(
    service: ProviderService,
    repository: ProviderRepository,
    sseService: ServerSideEventsService,
  ) {
    super(service, repository, sseService);
  }

  @Query(() => [ProviderEntity])
  async getProviders(
    @Args('filter', { nullable: true, type: () => GetProviderQueryDto })
    filter?: GetProviderQueryDto,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<ProviderEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => ProviderEntity)
  async createProvider(
    @Args('body', { nullable: false, type: () => CreateProviderMutationDto })
    body: CreateProviderMutationDto,
  ) {
    return super.create(body, EVENTS.PROVIDER);
  }

  @Mutation(() => ProviderEntity)
  async deleteProvider(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }
}
