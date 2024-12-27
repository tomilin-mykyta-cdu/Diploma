import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { FeedEntity } from '../feed/Feed.entity';
import { IngredientQualityEntity } from '../ingredientQuality/IngredientQuality.entity';

@ObjectType()
@Entity('feed_segment')
export class FeedSegmentEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true,
  })
  title: string;

  @Field(() => [FeedEntity])
  @OneToMany(() => FeedEntity, feed => feed.feedSegment)
  feed: FeedEntity[];

  @Field(() => [IngredientQualityEntity])
  @OneToMany(() => IngredientQualityEntity, ingredientQuality => ingredientQuality.feedSegment)
  ingredientQualities: IngredientQualityEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
