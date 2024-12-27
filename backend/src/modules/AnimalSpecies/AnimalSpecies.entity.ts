import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { FeedEntity } from '../feed/Feed.entity';

@ObjectType()
@Entity('animal_species')
export class AnimalSpeciesEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true,
  })
  title: string;

  @Field(() => [FeedEntity], { nullable: true })
  @OneToMany(() => FeedEntity, feedEntity => feedEntity.animalSpecies)
  feed: FeedEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
