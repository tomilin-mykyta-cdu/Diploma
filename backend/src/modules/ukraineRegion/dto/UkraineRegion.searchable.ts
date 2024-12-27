import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UkraineRegionSearchable {
	/**
	 * ANIMAL_SPECIES
	 */
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field(() => [String], { nullable: true })
	title?: string[];
}
