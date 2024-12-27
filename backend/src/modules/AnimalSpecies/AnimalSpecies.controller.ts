import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../../common/Events';
import { BaseController } from '../../hz/Base.controller';

@Controller('animal-species')
export class AnimalSpeciesController extends BaseController {
	constructor(eventEmitter: EventEmitter2,) {
		super([{ emitter: eventEmitter, name: 'getAnimalSpecies', event: EVENTS.ANIMAL_SPECIES, main: true  }]);
	}

	@Sse('sse')
	public animalSpeciesSubscriber() {
		return this.sse();
	}
}
