import { InputType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';

@InputType()
export class MarketDemandSearchable {
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field(() => GraphQLTimestamp, { nullable: true })
	createdAfter?: Date;

	@Field(() => GraphQLTimestamp, { nullable: true })
	createdBefore?: Date
}