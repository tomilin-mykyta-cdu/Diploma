import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('ingredient')
export class IngredientController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getIngredients', event: EVENTS.INGREDIENT, main: true  }]);
	}

	@Sse('sse')
	public async ingredientSubscriber() {
		return super.sse();
	}
}
