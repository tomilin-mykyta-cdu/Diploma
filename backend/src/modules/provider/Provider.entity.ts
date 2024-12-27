import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../hz/Base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { IngredientQualityEntity } from '../ingredientQuality/IngredientQuality.entity';

@ObjectType()
@Entity('provider')
export class ProviderEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true,
  })
  title: string;

  @Field(() => [IngredientQualityEntity])
  @OneToMany(() => IngredientQualityEntity, ingredientQuality => ingredientQuality.provider)
  ingredientQualities: IngredientQualityEntity[];

  @Field()
  @Column({ default: false })
  deleted: boolean = false;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
