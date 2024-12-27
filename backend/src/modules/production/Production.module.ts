import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionResolver } from './Production.resolver';
import { ProductionRepository } from './Production.repository';
import { ProductionEntity } from './Production.entity';
import { FeedModule } from '../feed/Feed.module';
import { ProductionService } from './Production.service';
import { AnimalSpeciesModule } from '../AnimalSpecies/AnimalSpecies.module';
import { FeedSegmentModule } from '../feedSegment/FeedSegment.module';
import { FeedTitleModule } from '../feedTitles/FeedTitle.module';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { ProductionController } from './Production.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductionEntity]),
    forwardRef(() => FeedModule),
    forwardRef(() => AnimalSpeciesModule),
    forwardRef(() => FeedSegmentModule),
    forwardRef(() => FeedTitleModule),
    ServerSideEventsModule,
  ],
  controllers: [
    ProductionController,
  ],
  providers: [
    ProductionResolver,
    ProductionService,
    ProductionRepository,
  ],
  exports: [
    ProductionService,
    ProductionRepository,
  ],
})
export class ProductionModule {}
