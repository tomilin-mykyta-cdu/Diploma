import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
	export class CreateProductionMutationDto {
	@Field(() => Int)
	feed: number;
}
