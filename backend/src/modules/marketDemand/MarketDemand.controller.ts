import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('market-demand')
export class MarketDemandController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([
			{ emitter: eventEmitter, name: 'getMarketDemands', event: EVENTS.MARKET_DEMAND, main: true  },
			{ emitter: eventEmitter, name: 'getPredictions', event: EVENTS.TRAIN_PREDICTION_MODEL, main: true  },
		]);
	}

	@Sse('sse')
	public async marketDemandSubscriber() {
		return super.sse();
	}

	@Sse('getPredictions/sse')
	public async marketDemandDynamicSubscriber() {
		return super.other('getPredictions');
	}
}
