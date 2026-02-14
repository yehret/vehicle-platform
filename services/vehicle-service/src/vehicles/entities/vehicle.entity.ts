import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class Vehicle {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'Unknown' })
	make: string;

	@Column({ default: 'Unknown' })
	model: string;

	@Column({ type: 'int', nullable: true })
	year: number;

	@Column()
	user_id: number;
}
