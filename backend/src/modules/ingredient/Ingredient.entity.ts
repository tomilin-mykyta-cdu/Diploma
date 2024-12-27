import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { FeedReceiptEntity } from '../feedReceipt/FeedReceipt.entity';
import { IngredientQualityEntity } from '../ingredientQuality/IngredientQuality.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('ingredient')
export class IngredientEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => [FeedReceiptEntity])
  @OneToMany(() => FeedReceiptEntity, feedReceipt => feedReceipt.ingredient)
  feedReceipts: FeedReceiptEntity[];

  @Field(() => [IngredientQualityEntity])
  @OneToMany(() => IngredientQualityEntity, ingredientQuality => ingredientQuality.ingredient)
  ingredientQualities: IngredientQualityEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
