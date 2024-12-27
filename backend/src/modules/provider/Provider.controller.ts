import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('provider')
export class ProviderController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getProviders', event: EVENTS.PROVIDER, main: true  }]);
	}

	@Sse('/sse')
	public async providerSubscriber() {
		return super.sse();
	}
}
