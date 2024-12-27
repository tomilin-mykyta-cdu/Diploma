import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductionSearchable } from './Production.searchable';

@InputType()
export class GetProductionQueryDto extends ProductionSearchable {
	/**
	 * PRODUCTION.FEED
	 */
	@Field(() => Int, { nullable: true })
	feedId?: number;


	/**
	 * FEED.FEED_TITLE
	 */
	@Field(() => [String], { nullable: true })
	feedTitle?: string[];


	/**
	 * PRODUCTION.FEED.ANIMAL_SPECIES
	 */
	@Field(() => Int, { nullable: true })
	animalSpeciesId?: number;

	@Field(() => [String], { nullable: true })
	animalSpeciesTitle?: string[];


	/**
	 * PRODUCTION.FEED.FEED_SEGMENT
	 */
	@Field(() => Int, { nullable: true })
	feedSegmentId?: number;

	@Field(() => [String], { nullable: true })
	feedSegmentTitle?: string[];
}
