import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UkraineRegionResolver } from './UkraineRegion.resolver';
import { UkraineRegionRepository } from './UkraineRegion.repository';
import { UkraineRegionEntity } from './UkraineRegion.entity';
import { UkraineRegionService } from './UkraineRegion.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { UkraineRegionController } from './UkraineRegion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UkraineRegionEntity]),
    ServerSideEventsModule,
  ],
  controllers: [
    UkraineRegionController,
  ],
  providers: [
    UkraineRegionResolver,
    UkraineRegionService,
    UkraineRegionRepository,
  ],
  exports: [
    UkraineRegionService,
    UkraineRegionRepository,
  ],
})
export class UkraineRegionModule {}