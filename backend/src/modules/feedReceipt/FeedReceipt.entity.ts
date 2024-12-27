import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeedEntity } from '../feed/Feed.entity';
import { IngredientEntity } from '../ingredient/Ingredient.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('feed_receipt')
export class FeedReceiptEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [FeedEntity])
  @ManyToOne(() => FeedEntity, (feed) => feed.feedReceipts)
  @JoinColumn({ name: 'feed_id' })
  feed: FeedEntity;

  @Field(() => [IngredientEntity])
  @ManyToOne(() => IngredientEntity, (ingredient) => ingredient.feedReceipts)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: IngredientEntity;

  // TODO:
  // @Field()
  // @Column({ default: false })
  // quantity: number;

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
