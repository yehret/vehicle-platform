import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
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

	@EventPattern('user.updated')
	handleUserUpdated(@Payload() data: any) {
		console.log('Caught user.updated event!', data);
	}

	@EventPattern('user.deleted')
	async handleUserDeleted(@Payload() userId: string) {
		console.log('Caught user.deleted event!', userId);
		await this.vehiclesService.remove(userId);
	}

	@Post()
	@UseGuards(AuthGuard)
	create(@Req() req: Request, @Body() createVehicleDto: CreateVehicleDto) {
		const userId = createVehicleDto.userId || req.session.userId;
		return this.vehiclesService.create(createVehicleDto, userId);
	}

	@Get()
	@UseGuards(AuthGuard)
	findAll(@Query('userId') userId?: string) {
		return this.vehiclesService.findAll(userId);
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	findOne(@Param('id') id: string) {
		return this.vehiclesService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
		return this.vehiclesService.update(id, updateVehicleDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	remove(@Param('id') id: string) {
		return this.vehiclesService.remove(id);
	}
}
