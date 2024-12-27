import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('feed-title')
export class FeedTitleController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getFeedTitles', event: EVENTS.FEED_TITLE, main: true  }]);
	}

	@Sse('sse')
	public async feedTitleSubscriber() {
		return super.sse();
	}
}
