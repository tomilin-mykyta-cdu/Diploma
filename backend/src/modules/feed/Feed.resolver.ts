import { Resolver, Query, ResolveField, Parent, Args, Mutation } from '@nestjs/graphql';
import { FeedEntity } from './Feed.entity';
import { FeedRepository } from './Feed.repository';
import { AnimalSpeciesEntity } from '../AnimalSpecies/AnimalSpecies.entity';
import { AnimalSpeciesRepository } from '../AnimalSpecies/AnimalSpecies.repository';
import { FeedSegmentEntity } from '../feedSegment/FeedSegment.entity';
import { FeedSegmentRepository } from '../feedSegment/FeedSegment.repository';
import { Pagination } from '../../common/Pagination';
import { GetFeedQuery } from './dto/GetFeedQuery.filter';
import { FeedService } from './Feed.service';
import { FeedTitleEntity } from '../feedTitles/FeedTitle.entity';
import { FeedTitleRepository } from '../feedTitles/FeedTitle.repository';
import { CreateFeedMutationDto } from './dto/CreateFeedMutation.dto';
import { EVENTS } from '../../common/Events';
import { ServerSideEventsService } from '../../infrastructure/ServerSideEvents/ServerSideEvents.service';
import { BaseResolver } from '../../hz/Base.resolver';

@Resolver(() => FeedEntity)
export class FeedResolver extends BaseResolver<FeedEntity> {
	constructor(
		service: FeedService,
		repository: FeedRepository,
		sseService: ServerSideEventsService,
		private readonly feedTitleRepository: FeedTitleRepository,
		private readonly animalSpeciesRepository: AnimalSpeciesRepository,
		private readonly feedSegmentRepository: FeedSegmentRepository
	) {
		super(service, repository, sseService);
	}

	@Query(() => [FeedEntity])
	async getFeed(
		@Args('filter', { nullable: true, type: () => GetFeedQuery })
		filter?: GetFeedQuery,
		@Args('pagination', { nullable: true, type: () => Pagination })
		pagination?: Pagination
	): Promise<FeedEntity[]> {
		return super.get(filter, pagination);
	}

	@Mutation(() => FeedEntity, { nullable: true })
	async createFeed(
		@Args('body', { nullable: false, type: () => CreateFeedMutationDto })
		body: CreateFeedMutationDto
	) {
		const createdFeed = await this.repository.findOneByCriteria({
			feedTitle: { id: body.feedTitle },
			animalSpecies: { id: body.animalSpecies },
			feedSegment: { id: body.feedSegment }
		});

		if (createdFeed) {
			return null;
		}

		return super.create(body, EVENTS.FEED);
	}

	@Mutation(() => FeedEntity)
	async deleteFeed(
		@Args({ name: 'id', type: () => Boolean })
		id: number
	) {
		return super.delete(id);
	}

	@ResolveField('animalSpecies', () => AnimalSpeciesEntity)
	async resolveProduction(@Parent() feed: FeedEntity): Promise<AnimalSpeciesEntity> {
		return this.animalSpeciesRepository.findOneByCriteria({
			feed: {
				id: feed.id
			}
		});
	}

	@ResolveField('feedSegment', () => FeedSegmentEntity)
	async resolveFeedSegment(@Parent() feed: FeedEntity): Promise<FeedSegmentEntity> {
		return this.feedSegmentRepository.findOneByCriteria({
			feed: {
				id: feed.id
			}
		});
	}

	@ResolveField('feedTitle', () => FeedTitleEntity)
	async resolveFeedTitle(@Parent() feed: FeedEntity): Promise<FeedTitleEntity> {
		return this.feedTitleRepository.findOneByCriteria({
			feed: {
				id: feed.id
			}
		});
	}
}
