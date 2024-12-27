import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedSegmentEntity } from './FeedSegment.entity';
import { FeedSegmentRepository } from './FeedSegment.repository';
import { FeedSegmentResolver } from './FeedSegment.resolver';
import { FeedSegmentService } from './FeedSegment.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { FeedSegmentController } from './FeedSegment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedSegmentEntity]),
    ServerSideEventsModule,
  ],
  controllers: [FeedSegmentController],
  providers: [
    FeedSegmentResolver,
    FeedSegmentService,
    FeedSegmentRepository,
  ],
  exports: [
    FeedSegmentService,
    FeedSegmentRepository,
  ],
})
export class FeedSegmentModule {}