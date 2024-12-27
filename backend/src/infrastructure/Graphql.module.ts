import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AnimalSpeciesModule } from '../modules/AnimalSpecies/AnimalSpecies.module';
import { FeedModule } from '../modules/feed/Feed.module';
import { FeedReceiptModule } from '../modules/feedReceipt/FeedReceipt.module';
import { FeedSegmentModule } from '../modules/feedSegment/FeedSegment.module';
import { IngredientModule } from '../modules/ingredient/Ingredient.module';
import { IngredientQualityModule } from '../modules/ingredientQuality/IngredientQuality.module';
import { MarketDemandModule } from '../modules/marketDemand/MarketDemand.module';
import { ProductionModule } from '../modules/production/Production.module';
import { ProviderModule } from '../modules/provider/Provider.module';
import { UkraineRegionModule } from '../modules/ukraineRegion/UkraineRegion.module';
import { FeedTitleEntity } from '../modules/feedTitles/FeedTitle.entity';
import { RandomForestService } from '../services/RandomForest.service';

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			playground: true,
			driver: ApolloDriver,
			autoSchemaFile: 'schema.gql',
		}),
		AnimalSpeciesModule,
		FeedTitleEntity,
		FeedModule,
		FeedReceiptModule,
		FeedSegmentModule,
		IngredientModule,
		IngredientQualityModule,
		MarketDemandModule,
		ProductionModule,
		ProviderModule,
		UkraineRegionModule,
	],
	providers: [
		RandomForestService,

	]
})
export class GraphqlModule {}
