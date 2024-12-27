import { BaseEntity as BaseTypeOrmEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from '@nestjs/graphql';

export class BaseEntity extends BaseTypeOrmEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ default: false })
	deleted: boolean = false;

	@Field()
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;
}