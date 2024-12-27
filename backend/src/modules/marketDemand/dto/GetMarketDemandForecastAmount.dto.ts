import { InputType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { MarketDemandSearchable } from './MarketDemand.searchable';
import { GetMarketDemandDto } from './GetMarketDemand.dto';

@InputType()
export class GetMarketDemandDtoForecastAmount extends GetMarketDemandDto {
	@Field(() => String)
	period: 'weekly' | 'monthly';
}
