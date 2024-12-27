import { forwardRef, Module } from '@nestjs/common';
import { AnimalSpeciesEntity } from './AnimalSpecies.entity';
import { AnimalSpeciesResolver } from './AnimalSpecies.resolver';
import { AnimalSpeciesRepository } from './AnimalSpecies.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedModule } from '../feed/Feed.module';
import { AnimalSpeciesService } from './AnimalSpecies.service';
import { FeedTitleModule } from '../feedTitles/FeedTitle.module';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { AnimalSpeciesController } from './AnimalSpecies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalSpeciesEntity]),
    forwardRef(() => FeedModule),
    forwardRef(() => FeedTitleModule),
    ServerSideEventsModule,
  ],
  providers: [
    AnimalSpeciesResolver,
    AnimalSpeciesService,
    AnimalSpeciesRepository,
  ],
  controllers: [
    AnimalSpeciesController
  ],
  exports: [
    AnimalSpeciesService,
    AnimalSpeciesRepository,
  ],
})
export class AnimalSpeciesModule {}