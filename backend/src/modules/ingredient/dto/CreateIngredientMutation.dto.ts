import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateIngredientMutationDto {
	@Field(() => String)
	title: string;
}
