import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FeedSearchable {
	@Field(() => Int, { nullable: true })
	id?: number;
}