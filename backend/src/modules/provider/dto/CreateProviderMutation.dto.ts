import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateProviderMutationDto {
	@Field(() => String)
	title: string;
}
