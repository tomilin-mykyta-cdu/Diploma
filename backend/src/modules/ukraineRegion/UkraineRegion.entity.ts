import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { MarketDemandEntity } from '../marketDemand/MarketDemand.entity';

@ObjectType()
@Entity('ukraine_region')
export class UkraineRegionEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true,
  })
  title: string;

  @Field(() => [MarketDemandEntity])
  @OneToMany(() => MarketDemandEntity, marketDemand => marketDemand.ukraineRegion)
  marketDemands: MarketDemandEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
