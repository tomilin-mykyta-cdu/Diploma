import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
	export class CreateMarketDemandMutationDto {
	@Field(() => Int)
	production: number;

	@Field(() => Int)
	ukraineRegion: number;

	@Field(() => Int)
	price: number;
}