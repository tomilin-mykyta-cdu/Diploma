import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class KeyValuePair {
	@Field(() => Int)
	year: number;

	@Field(() => Int)
	month: number;

	@Field(() => Int, { nullable: true })
	week?: number;

	@Field(() => Int)
	count: number;
}

@ObjectType()
export class RecordResponse {
	@Field(() => [KeyValuePair])
	records: KeyValuePair[];
}