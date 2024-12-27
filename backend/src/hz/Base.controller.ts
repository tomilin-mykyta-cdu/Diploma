import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../common/Events';
import { fromEvent, map } from 'rxjs';
import { BaseEntity } from './Base.entity';

export class BaseController {
	constructor(
		protected readonly arrayOfEvents: Array<{
			emitter: EventEmitter2,
			name: string,
			event: keyof typeof EVENTS,
			main: boolean,
		}>
	) {}

	public async sse() {
		const main = this.arrayOfEvents.find(x => x.main === true);
		return fromEvent(
			main.emitter,
			main.event,
		).pipe(map((value: BaseEntity) => {
			return ({
				event: main.event,
				data: { [main.name]: value },
			})
		}));
	}

	public async other(name: string) {
		const main = this.arrayOfEvents.find(x => x.name === name);
		return fromEvent(
			main.emitter,
			main.event,
		).pipe(map((value: BaseEntity) => {
			return ({
				event: main.event,
				data: { [main.name]: value },
			})
		}));
	}
}


