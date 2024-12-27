import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('production')
export class ProductionController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getProductions', event: EVENTS.PRODUCTION, main: true  }]);
	}

	@Sse('sse')
	public async productionSubscriber() {
		return super.sse();
	}
}
