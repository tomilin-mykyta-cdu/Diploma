import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FeedSegmentSearchable {
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field(() => [String], { nullable: true })
	title?: string[];
}