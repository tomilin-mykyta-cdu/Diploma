import { Module } from '@nestjs/common';
import { ServerSideEventsService } from './ServerSideEvents.service';
import { EventEmitterModule } from '../EventEmitter.module';

@Module({
	imports: [
		EventEmitterModule
	],
	providers: [
		ServerSideEventsService
	],
	exports: [
		ServerSideEventsService
	],
})
export class ServerSideEventsModule {}
