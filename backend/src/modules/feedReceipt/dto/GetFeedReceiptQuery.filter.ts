import { InputType, Field, Int } from '@nestjs/graphql';
import { FeedReceiptSearchable } from './FeedReceipt.searchable';

@InputType()
export class GetFeedReceiptQueryFilter extends FeedReceiptSearchable {
	/**
	 * FEED_RECEIPT.INGREDIENT
	 */
	@Field(() => Int, { nullable: true })
	ingredientId?: number;

	@Field(() => [String], { nullable: true })
	ingredientTitle?: string[];


	/**
	 * FEED_RECEIPT.FEED
	 */
	@Field(() => Int, { nullable: true })
	feedId?: number;


	/**
	 * FEED_RECEIPT.FEED.FEED_TITLE
	 */
	@Field(() => [String], { nullable: true })
	feedTitle?: string[];


	/**
	 * FEED_RECEIPT.FEED.FEED_SEGMENT
	 */
	@Field(() => Int, { nullable: true })
	feedSegmentId?: number;

	@Field(() => [String], { nullable: true })
	feedSegmentTitle?: string[];


	/**
	 * FEED_RECEIPT.FEED.ANIMAL_SPECIES
	 */
	@Field(() => Int, { nullable: true })
	animalSpeciesId?: number;

	@Field(() => [String], { nullable: true })
	animalSpeciesTitle?: string[];
}
