import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRepository } from './Feed.repository';
import { FeedResolver } from './Feed.resolver';
import { FeedEntity } from './Feed.entity';
import { AnimalSpeciesModule } from '../AnimalSpecies/AnimalSpecies.module';
import { FeedSegmentModule } from '../feedSegment/FeedSegment.module';
import { FeedService } from './Feed.service';
import { FeedTitleModule } from '../feedTitles/FeedTitle.module';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { FeedController } from './Feed.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
    forwardRef(() => AnimalSpeciesModule),
    forwardRef(() => FeedSegmentModule),
    forwardRef(() => FeedTitleModule),
    ServerSideEventsModule,
  ],
  controllers: [
    FeedController,
  ],
  providers: [
    FeedResolver,
    FeedService,
    FeedRepository,
  ],
  exports: [
    FeedService,
    FeedRepository,
  ],
})
export class FeedModule {}
