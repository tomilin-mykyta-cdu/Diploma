import { InputType, Field } from '@nestjs/graphql';

@InputType()
	export class CreateFeedSegmentMutationDto {
	@Field(() => String)
	title: string;
}
