import { InputType, Field, Int } from '@nestjs/graphql';
import { FeedSearchable } from './Feed.searchable';

@InputType()
export class GetFeedQuery extends FeedSearchable {
	/**
	 * FEED.ANIMAL_SPECIES
	 */
	@Field(() => Int, { nullable: true })
	animalSpeciesId?: number;

	@Field(() => [String], { nullable: true })
	animalSpeciesTitle?: string[];


	/**
	 * FEED.FEED_SEGMENT
	 */
	@Field(() => Int, { nullable: true })
	feedSegmentId?: number;

	@Field(() => [String], { nullable: true })
	feedSegmentTitle?: string[];


	/**
	 * FEED.FEED_TITLE
	 */
	@Field(() => [String], { nullable: true })
	feedTitle?: string[];
}
