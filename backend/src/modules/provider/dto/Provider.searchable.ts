import { InputType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';

@InputType()
export class ProviderSearchable {
	@Field(() => Int, { nullable: true })
	id?: number;

	@Field(() => [String], { nullable: true })
	title?: string[];

	@Field(() => GraphQLTimestamp, { nullable: true })
	createdAfter?: Date;

	@Field(() => GraphQLTimestamp, { nullable: true })
	createdBefore?: Date
}
