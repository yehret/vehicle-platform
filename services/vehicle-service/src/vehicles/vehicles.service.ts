import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
	constructor(
		@InjectRepository(Vehicle)
		private readonly vehiclesRepository: Repository<Vehicle>
	) {}

	async createEmptyForUser(userId: number): Promise<Vehicle> {
		const newVehicle = this.vehiclesRepository.create({
			user_id: userId,
			make: 'Unknown',
			model: 'Unknown'
		});
		return await this.vehiclesRepository.save(newVehicle);
	}

	async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
		const vehicle = this.vehiclesRepository.create(createVehicleDto);
		return await this.vehiclesRepository.save(vehicle);
	}

	async findAll(): Promise<Vehicle[]> {
		return await this.vehiclesRepository.find();
	}

	async findOne(id: number): Promise<Vehicle> {
		const vehicle = await this.vehiclesRepository.findOneBy({ id });
		if (!vehicle) {
			throw new NotFoundException(`Vehicle with ID ${id} not found`);
		}
		return vehicle;
	}

	async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
		await this.vehiclesRepository.update(id, updateVehicleDto);
		return this.findOne(id);
	}

	async remove(id: number): Promise<void> {
		const result = await this.vehiclesRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Vehicle with ID ${id} not found`);
		}
	}
}
