import { Module } from '@nestjs/common';
import { PresentationController } from './Presentation.controller';
import { MarketDemandModule } from '../modules/marketDemand/MarketDemand.module';
import { UkraineRegionModule } from '../modules/ukraineRegion/UkraineRegion.module';
import { ProductionModule } from '../modules/production/Production.module';
import { ServerSideEventsModule } from '../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { RandomForestService } from '../services/RandomForest.service';

@Module({
	imports: [
		MarketDemandModule,
		ProductionModule,
		UkraineRegionModule,
		ServerSideEventsModule,
	],
	controllers: [
		PresentationController
	],
	providers: [
		RandomForestService,
	]
})
export class PresentationModule {
}