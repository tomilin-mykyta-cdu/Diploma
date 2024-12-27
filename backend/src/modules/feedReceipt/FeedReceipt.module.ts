import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedReceiptEntity } from './FeedReceipt.entity';
import { FeedReceiptResolver } from './FeedReceipt.resolver';
import { FeedReceiptRepository } from './FeedReceipt.repository';
import { FeedModule } from '../feed/Feed.module';
import { IngredientModule } from '../ingredient/Ingredient.module';
import { FeedReceiptService } from './FeedReceipt.service';
import { FeedSegmentModule } from '../feedSegment/FeedSegment.module';
import { AnimalSpeciesModule } from '../AnimalSpecies/AnimalSpecies.module';
import { FeedTitleModule } from '../feedTitles/FeedTitle.module';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { FeedReceiptController } from './FeedReceipt.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedReceiptEntity]),
    forwardRef(() => FeedModule),
    forwardRef(() => IngredientModule),
    forwardRef(() => FeedSegmentModule),
    forwardRef(() => AnimalSpeciesModule),
    forwardRef(() => FeedTitleModule),
    ServerSideEventsModule,
  ],
  controllers: [
    FeedReceiptController,
  ],
  providers: [
    FeedReceiptResolver,
    FeedReceiptService,
    FeedReceiptRepository,
  ],
  exports: [
    FeedReceiptService,
    FeedReceiptRepository,
  ],
})
export class FeedReceiptModule {}
