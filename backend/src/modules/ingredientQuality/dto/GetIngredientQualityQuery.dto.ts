import { Field, InputType, Int } from '@nestjs/graphql';
import { IngredientQualitySearchable } from './IngredientQuality.searchable';

@InputType()
export class GetIngredientQualityQueryDto extends IngredientQualitySearchable {
    /**
     * INGREDIENT_QUALITY.INGREDIENT
     */
    @Field(() => Int, { nullable: true })
    ingredientId?: number;

    @Field(() => [String], { nullable: true })
    ingredientTitle?: string[];

    /**
     * INGREDIENT_QUALITY.PROVIDER
     */
    @Field(() => Int, { nullable: true })
    providerId?: number;

    @Field(() => [String], { nullable: true })
    providerTitle?: string[];

    /**
     * INGREDIENT_QUALITY.FEED_SEGMENT
     */
    @Field(() => Int, { nullable: true })
    feedSegmentId?: number;

    @Field(() => [String], { nullable: true })
    feedSegmentTitle?: string[];
}
