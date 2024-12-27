import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from './Ingredient.entity';
import { IngredientResolver } from './Ingredient.resolver';
import { IngredientRepository } from './Ingredient.repository';
import { IngredientService } from './Ingredient.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { IngredientController } from './Ingredient.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientEntity]),
    ServerSideEventsModule,
  ],
  controllers: [IngredientController],
  providers: [
    IngredientResolver,
    IngredientService,
    IngredientRepository,
  ],
  exports: [
    IngredientService,
    IngredientRepository,
  ],
})
export class IngredientModule {}