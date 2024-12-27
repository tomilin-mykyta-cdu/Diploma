import { InputType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { MarketDemandSearchable } from './MarketDemand.searchable';

@InputType()
export class GetMarketDemandDto extends MarketDemandSearchable {
	/**
	 * DEMAND.UKRAINE_REGION
	 */
	@Field(() => [String], { nullable: true })
	ukraineRegionTitle?: string[];


	/**
	 * DEMAND.PRODUCTION
	 */
	@Field(() => Int, { nullable: true })
	productionId?: number;

	@Field(() => Int, { nullable: true })
	amountCreated?: number;

	@Field(() => GraphQLTimestamp, { nullable: true })
	productionCreatedBefore?: Date;

	@Field(() => GraphQLTimestamp, { nullable: true })
	productionCreatedAfter?: Date;


	/**
	 * DEMAND.PRODUCTION.FEED
	 */
	@Field(() => Int, { nullable: true })
	feedId?: number;


	/**
	 * FEED.FEED_TITLE
	 */
	@Field(() => [String], { nullable: true })
	feedTitle?: string[];


	/**
	 * DEMAND.PRODUCTION.FEED.ANIMAL_SPECIES
	 */
	@Field(() => Int, { nullable: true })
	animalSpeciesId?: number;

	@Field(() => [String], { nullable: true })
	animalSpeciesTitle?: string[];


	/**
	 * DEMAND.PRODUCTION.FEED.FEED_SEGMENT
	 */
	@Field(() => Int, { nullable: true })
	feedSegmentId?: number;

	@Field(() => [String], { nullable: true })
	feedSegmentTitle?: string[];
}
