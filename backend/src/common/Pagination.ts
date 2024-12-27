import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class Pagination {
	@Field(() => Int, { nullable: true })
	page?: number;

	@Field(() => Int, { nullable: true })
	pageSize?: number;
}