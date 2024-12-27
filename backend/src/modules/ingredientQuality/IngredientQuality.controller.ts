import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('ingredient-quality')
export class IngredientQualityController extends BaseController {
	constructor(eventEmitter: EventEmitter2) {
		super([{ emitter: eventEmitter, name: 'getIngredientQualities', event: EVENTS.INGREDIENT_QUALITY, main: true  }]);
	}

	@Sse('sse')
	public async ingredientQualitySubscriber() {
		return super.sse();
	}
}
