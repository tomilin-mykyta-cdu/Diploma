import { InputType } from '@nestjs/graphql';
import { IngredientSearchable } from './Ingredient.searchable';

@InputType()
export class GetIngredientQueryDto extends IngredientSearchable {
}