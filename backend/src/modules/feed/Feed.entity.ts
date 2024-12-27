import { Entity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { AnimalSpeciesEntity } from '../AnimalSpecies/AnimalSpecies.entity';
import { FeedSegmentEntity } from '../feedSegment/FeedSegment.entity';
import { FeedReceiptEntity } from '../feedReceipt/FeedReceipt.entity';
import { ProductionEntity } from '../production/Production.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { FeedTitleEntity } from '../feedTitles/FeedTitle.entity';

@ObjectType()
@Entity('feed')
export class FeedEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => AnimalSpeciesEntity)
  @ManyToOne(() => AnimalSpeciesEntity, animalType => animalType.feed)
  @JoinColumn({ name: 'animal_species_id' })
  animalSpecies: AnimalSpeciesEntity;

  @Field(() => FeedSegmentEntity)
  @ManyToOne(() => FeedSegmentEntity, feedSegment => feedSegment.feed)
  @JoinColumn({ name: 'feed_segment_id' })
  feedSegment: FeedSegmentEntity;

  @Field(() => FeedTitleEntity, { nullable: true })
  @ManyToOne(() => FeedTitleEntity, feedTitle => feedTitle.feed)
  @JoinColumn({ name: 'feed_title_id' })
  feedTitle: FeedTitleEntity;

  @Field(() => [FeedReceiptEntity])
  @OneToMany(() => FeedReceiptEntity, feedReceipt => feedReceipt.feed)
  feedReceipts: FeedReceiptEntity[];

  @Field(() => [ProductionEntity], { nullable: true })
  @OneToMany(() => ProductionEntity, production => production.feed)
  productions: ProductionEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
