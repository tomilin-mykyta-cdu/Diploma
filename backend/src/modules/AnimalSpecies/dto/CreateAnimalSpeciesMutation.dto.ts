import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateAnimalSpeciesMutationDto {
	@Field(() => String)
	title: string;
}
