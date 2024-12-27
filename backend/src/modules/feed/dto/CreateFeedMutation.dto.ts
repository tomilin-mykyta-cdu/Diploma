import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
	export class CreateFeedMutationDto {
	@Field(() => Int)
	animalSpecies: number;

	@Field(() => Int)
	feedSegment: number;

	@Field(() => Int)
	feedTitle: number;
}
