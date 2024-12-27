import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderResolver } from './Provider.resolver';
import { ProviderRepository } from './Provider.repository';
import { ProviderEntity } from './Provider.entity';
import { ProviderService } from './Provider.service';
import { ServerSideEventsModule } from '../../infrastructure/ServerSideEvents/ServerSideEvents.module';
import { ProviderController } from './Provider.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProviderEntity]),
    ServerSideEventsModule,
  ],
  controllers: [ProviderController],
  providers: [
    ProviderResolver,
    ProviderService,
    ProviderRepository,
  ],
  exports: [
    ProviderService,
    ProviderRepository,
  ],
})
export class ProviderModule {}