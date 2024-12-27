import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('feed-segments')
export class FeedSegmentController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getFeedSegments', event: EVENTS.FEED_SEGMENT, main: true  }]);
	}

	@Sse('sse')
	public async feedSegmentSubscriber() {
		return super.sse();
	}
}
