import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServerSideEventsModule } from './infrastructure/ServerSideEvents/ServerSideEvents.module';
import { EventEmitterModule } from './infrastructure/EventEmitter.module';
import { GraphqlModule } from './infrastructure/Graphql.module';
import { TypeOrmModule } from './infrastructure/TypeOrm.module';
import { PresentationModule } from './presentation/Presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    ServerSideEventsModule,
    EventEmitterModule,
    GraphqlModule,
    PresentationModule,
  ]
})
export class AppModule {}

