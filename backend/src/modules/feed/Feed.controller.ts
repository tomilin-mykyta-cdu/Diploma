import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('feed')
export class FeedController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getFeed', event: EVENTS.ANIMAL_SPECIES, main: true  }]);
	}

	@Sse('sse')
	public async feedSubscriber() {
		return this.sse();
	}
}