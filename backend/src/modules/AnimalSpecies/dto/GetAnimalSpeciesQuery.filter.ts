import { InputType, Field, Int } from '@nestjs/graphql';
import { AnimalSpeciesSearchable } from './AnimalSpecies.searchable';

@InputType()
export class GetAnimalSpeciesQuery extends AnimalSpeciesSearchable {
	/**
	 * ANIMAL_SPECIES.FEED
	 */
	@Field(() => Int, { nullable: true })
	feedId?: number;

	@Field(() => [String], { nullable: true })
	feedTitle?: string[];
}
