import { Entity, ManyToOne, Column, JoinColumn, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { FeedEntity } from '../feed/Feed.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { MarketDemandEntity } from '../marketDemand/MarketDemand.entity';

@ObjectType()
@Entity('production')
export class ProductionEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => FeedEntity)
  @ManyToOne(() => FeedEntity, feed => feed.productions)
  @JoinColumn({ name: 'feed_id' })
  feed: FeedEntity;

  @Field()
  @Column()
  amount: number; // amount_created

  @OneToMany(() => MarketDemandEntity, marketDemand => marketDemand.production)
  marketDemands: MarketDemandEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // @ManyToOne(() => IngredientEntity)
  // ingridientQuality: IngridientQualityEntity;

  // @ManyToOne(() => StorageEntity)
  // storage: StorageEntity;
}
