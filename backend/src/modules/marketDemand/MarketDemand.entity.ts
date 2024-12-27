import { Entity, ManyToOne, Column, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionEntity } from '../production/Production.entity';
import { UkraineRegionEntity } from '../ukraineRegion/UkraineRegion.entity';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('market_demand')
export class MarketDemandEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ProductionEntity)
  @ManyToOne(() => ProductionEntity, production => production.marketDemands)
  @JoinColumn({ name: 'production_id' })
  production: ProductionEntity;

  @Field(() => UkraineRegionEntity)
  @ManyToOne(() => UkraineRegionEntity, ukraineRegion => ukraineRegion.marketDemands)
  @JoinColumn({ name: 'ukraine_region_id' })
  ukraineRegion: UkraineRegionEntity;

  @Field()
  @Column({ nullable: true })
  price: number;

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

@ObjectType()
export class MarketDemandForecast {
  @Field()
  id: number;

  @Field(() => ProductionEntity)
  production: ProductionEntity;

  @Field(() => UkraineRegionEntity)
  ukraineRegion: UkraineRegionEntity;

  @Field()
  price: number;

  @Field()
  deleted: boolean = false;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  prediction: number;
}