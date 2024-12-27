import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FeedReceiptSearchable {
	@Field(() => Int, { nullable: true })
	id?: number;
}