import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class IngredientQualitySearchable {
	@Field(() => Int, { nullable: true })
	id?: number;
}