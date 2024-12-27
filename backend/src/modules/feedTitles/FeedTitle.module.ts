import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedTitleRepository } from './FeedTitle.repository';
import { FeedTitleResolver } from './FeedTitle.resolver';
import { FeedTitleEntity } from './FeedTitle.entity';
import { FeedTitleService } from './FeedTitle.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { FeedTitleController } from './FeedTitle.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedTitleEntity]),
    ServerSideEventsModule,
  ],
  controllers: [FeedTitleController],
  providers: [
    FeedTitleResolver,
    FeedTitleService,
    FeedTitleRepository,
  ],
  exports: [
    FeedTitleService,
    FeedTitleRepository,
  ],
})
export class FeedTitleModule {}
