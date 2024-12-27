import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('ukraine-region')
export class UkraineRegionController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getUkraineRegions', event: EVENTS.UKRAINE_REGION, main: true  }]);
	}

	@Sse('sse')
	public async ukraineRegionSubscriber() {
		return super.sse();
	}
}
