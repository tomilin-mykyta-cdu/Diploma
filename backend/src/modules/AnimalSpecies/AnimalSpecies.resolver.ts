import { Resolver, Query, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { AnimalSpeciesEntity } from './AnimalSpecies.entity';
import { AnimalSpeciesRepository } from './AnimalSpecies.repository';
import { FeedEntity } from '../feed/Feed.entity';
import { FeedRepository } from '../feed/Feed.repository';
import { GetAnimalSpeciesQuery } from './dto/GetAnimalSpeciesQuery.filter';
import { AnimalSpeciesService } from './AnimalSpecies.service';
import { Pagination } from '../../common/Pagination';
import {
  CreateAnimalSpeciesMutationDto
} from './dto/CreateAnimalSpeciesMutation.dto';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { EVENTS } from '../../common/Events';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => AnimalSpeciesEntity)
export class AnimalSpeciesResolver extends BaseResolver<AnimalSpeciesEntity> {
  constructor(
    service: AnimalSpeciesService,
    repository: AnimalSpeciesRepository,
    sseService: ServerSideEventsService,
    private readonly feedRepository: FeedRepository,
    ) {
    super(service, repository, sseService);
  }

  @Query(() => [AnimalSpeciesEntity])
  async getAnimalSpecies(
    @Args('filter', { nullable: true, type: () => GetAnimalSpeciesQuery })
    filter?: GetAnimalSpeciesQuery,
    @Args('pagination', { nullable: true, type: () => Pagination })
    pagination?: Pagination,
  ): Promise<AnimalSpeciesEntity[]> {
    return super.get(filter, pagination);
  }

  @Mutation(() => AnimalSpeciesEntity)
  async createAnimalSpecies(
    @Args('body', { nullable: false, type: () => CreateAnimalSpeciesMutationDto })
    body: CreateAnimalSpeciesMutationDto,
  ) {
    return super.create(body, EVENTS.ANIMAL_SPECIES);
  }

  @Mutation(() => AnimalSpeciesEntity)
  async deleteAnimalSpecies(
    @Args({ name: 'id', type: () => Boolean })
    id: number
  ) {
    return super.delete(id);
  }


  @ResolveField('feed', () => [FeedEntity])
  async resolveProduction(@Parent() animalSpecies: AnimalSpeciesEntity): Promise<FeedEntity[]> {
    return this.feedRepository.findManyByCriteria({
      where: {
        animalSpecies: {
          id: animalSpecies.id,
        }
      }
    });
  }
}