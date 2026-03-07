import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VehicleOwnerGuard } from 'src/common/guards/vehicleOwner.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}
	@EventPattern('user.created')
	async handleUserCreated(@Payload() userId: string) {
		console.log('Caught user.created event!', userId);
		await this.vehiclesService.createEmpty(userId);
	}

	@Post()
	@UseGuards(AuthGuard)
	create(@Req() req: Request, @Body() createVehicleDto: CreateVehicleDto) {
		const userId = req.session.userId;
		return this.vehiclesService.create(userId, createVehicleDto);
	}

	@Get()
	findAll() {
		return this.vehiclesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.vehiclesService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard, VehicleOwnerGuard)
	update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
		return this.vehiclesService.update(id, updateVehicleDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, VehicleOwnerGuard)
	remove(@Param('id') id: string) {
		return this.vehiclesService.remove(id);
	}
}
