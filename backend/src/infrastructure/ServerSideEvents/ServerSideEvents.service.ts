import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerSideEventsService {
	constructor(private eventEmitter: EventEmitter2) {}

	emitEvent(eventName: string, payload: any) {
		this.eventEmitter.emit(eventName, payload);
	}
}