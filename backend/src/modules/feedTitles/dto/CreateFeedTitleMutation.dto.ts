import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateFeedTitleMutationDto {
	@Field(() => String)
	title: string;
}
