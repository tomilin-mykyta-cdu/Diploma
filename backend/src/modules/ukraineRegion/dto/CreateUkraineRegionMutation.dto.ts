import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateUkraineRegionMutationDto {
	@Field(() => String)
	title: string;
}
