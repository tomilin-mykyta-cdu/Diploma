import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientQualityResolver } from './IngredientQuality.resolver';
import { IngredientQualityRepository } from './IngredientQuality.repository';
import { IngredientQualityEntity } from './IngredientQuality.entity';
import { IngredientModule } from '../ingredient/Ingredient.module';
import { ProviderModule } from '../provider/Provider.module';
import { FeedSegmentModule } from '../feedSegment/FeedSegment.module';
import { IngredientQualityService } from './IngredientQuality.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { IngredientQualityController } from './IngredientQuality.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientQualityEntity]),
    forwardRef(() => IngredientModule),
    forwardRef(() => ProviderModule),
    forwardRef(() => FeedSegmentModule),
    ServerSideEventsModule,
  ],
  controllers: [IngredientQualityController],
  providers: [
    IngredientQualityResolver,
    IngredientQualityService,
    IngredientQualityRepository,
  ],
  exports: [
    IngredientQualityService,
    IngredientQualityRepository,
  ],
})
export class IngredientQualityModule {}