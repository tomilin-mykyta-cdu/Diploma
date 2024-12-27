import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('feed-receipt')
export class FeedReceiptController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getFeedReceipts', event: EVENTS.FEED_RECEIPT, main: true  }]);
	}

	@Sse('sse')
	public async feedSubscriber() {
		return super.sse();
	}
}
