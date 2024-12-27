import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
	export class CreateFeedReceiptMutationDto {
	@Field(() => Int)
	feed: number;

	@Field(() => Int)
	ingredient: number;
}
