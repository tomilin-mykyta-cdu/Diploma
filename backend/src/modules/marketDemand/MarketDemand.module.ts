import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDemandRepository } from './MarketDemand.repository';
import { MarketDemandResolver } from './MarketDemand.resolver';
import { MarketDemandEntity } from './MarketDemand.entity';
import { ProductionModule } from '../production/Production.module';
import { UkraineRegionModule } from '../ukraineRegion/UkraineRegion.module';
import { MarketDemandService } from './MarketDemand.service';
import { FeedService } from '../feed/Feed.service';
import { AnimalSpeciesService } from '../AnimalSpecies/AnimalSpecies.service';
import { FeedSegmentService } from '../feedSegment/FeedSegment.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { FeedTitleModule } from '../feedTitles/FeedTitle.module';
import { MarketDemandController } from './MarketDemand.controller';
import { RandomForestService } from '../../services/RandomForest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketDemandEntity]),
    forwardRef(() => ProductionModule),
    forwardRef(() => UkraineRegionModule),
    forwardRef(() => FeedTitleModule),
    ServerSideEventsModule,
  ],
  controllers: [
    MarketDemandController,
  ],
  providers: [
    MarketDemandResolver,
    MarketDemandService,
    MarketDemandRepository,
    FeedService,
    AnimalSpeciesService,
    FeedSegmentService,
    RandomForestService,
  ],
  exports: [
    MarketDemandService,
    MarketDemandRepository,
  ],
})
export class MarketDemandModule {}
