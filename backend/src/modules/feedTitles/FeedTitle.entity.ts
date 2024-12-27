import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ProductionEntity } from '../production/Production.entity';
import { FeedEntity } from '../feed/Feed.entity';

@ObjectType()
@Entity('feed_title')
export class FeedTitleEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field(() => [FeedEntity], { nullable: true })
  @OneToMany(() => FeedEntity, feed => feed.feedTitle)
  feed: ProductionEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
