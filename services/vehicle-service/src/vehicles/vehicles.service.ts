import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
	constructor(private readonly prismaService: PrismaService) {}

	async createEmptyForUser(userId: string): Promise<Vehicle> {
		return await this.prismaService.vehicle.create({
			data: {
				userId: userId,
				make: 'Unknown',
				model: 'Unknown'
			}
		});
	}

	async create(dto: CreateVehicleDto): Promise<Vehicle> {
		return await this.prismaService.vehicle.create({
			data: dto
		});
	}

	// async findAll(): Promise<Vehicle[]> {
	// 	return await this.prismaService.vehicle.findMany();
	// }

	async findOne(id: string): Promise<Vehicle> {
		const vehicle = await this.prismaService.vehicle.findUnique({
			where: { id }
		});
		if (!vehicle) {
			throw new NotFoundException(`Машину з ID ${id} не знайдено`);
		}
		return vehicle;
	}

	async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
		try {
			return await this.prismaService.vehicle.update({
				where: { id },
				data: dto
			});
		} catch (error) {
			throw new NotFoundException(`Неможливо оновити: машину з ID ${id} не знайдено`, error);
		}
	}

	async remove(id: string): Promise<void> {
		try {
			await this.prismaService.vehicle.delete({ where: { id } });
		} catch (error) {
			throw new NotFoundException(`Неможливо видалити: машину з ID ${id} не знайдено`, error);
		}
	}
}
