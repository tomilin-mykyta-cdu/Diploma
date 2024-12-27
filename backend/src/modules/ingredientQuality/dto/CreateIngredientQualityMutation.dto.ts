import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
	export class CreateIngredientQualityMutationDto {
	@Field(() => Int)
	ingredient: number;

	@Field(() => Int)
	provider: number;

	@Field(() => Int)
	feedSegment: number;

	@Field(() => Int)
	price: number;
}
