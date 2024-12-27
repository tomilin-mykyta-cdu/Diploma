import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IngredientEntity } from '../ingredient/Ingredient.entity';
import { ProviderEntity } from '../provider/Provider.entity';
import { FeedSegmentEntity } from '../feedSegment/FeedSegment.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('ingredient_quality')
export class IngredientQualityEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => IngredientEntity)
  @ManyToOne(() => IngredientEntity, ingredient => ingredient.ingredientQualities)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: IngredientEntity;

  @Field(() => ProviderEntity)
  @ManyToOne(() => ProviderEntity, provider => provider.ingredientQualities)
  @JoinColumn({ name: 'provider_id' })
  provider: ProviderEntity;

  @Field(() => FeedSegmentEntity)
  @ManyToOne(() => FeedSegmentEntity, feedSegment => feedSegment.ingredientQualities)
  @JoinColumn({ name: 'feed_segment_id' })
  feedSegment: FeedSegmentEntity;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
