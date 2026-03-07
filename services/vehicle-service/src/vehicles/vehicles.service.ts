import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
	constructor(private readonly prismaService: PrismaService) {}

	async createEmpty(userId: string): Promise<Vehicle> {
		return await this.prismaService.vehicle.create({
			data: {
				userId: userId,
				make: 'Unknown',
				model: 'Unknown'
			}
		});
	}

	async create(userId: string, dto: CreateVehicleDto): Promise<Vehicle> {
		if (!userId) {
			throw new NotFoundException('User not found');
		}

		return await this.prismaService.vehicle.create({
			data: {
				...dto,
				userId
			}
		});
	}

	async findAll(): Promise<Vehicle[]> {
		return await this.prismaService.vehicle.findMany();
	}

	async findOne(id: string): Promise<Vehicle> {
		const vehicle = await this.prismaService.vehicle.findUnique({
			where: { id }
		});
		if (!vehicle) {
			throw new NotFoundException(`Not Found`);
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
			throw new NotFoundException(`Can't update. Vehicle not found`, error);
		}
	}

	async remove(id: string): Promise<void> {
		try {
			await this.prismaService.vehicle.delete({ where: { id } });
		} catch (error) {
			throw new NotFoundException(`Can't delete. Vehicle not found`, error);
		}
	}
}
