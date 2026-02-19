import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}
	@EventPattern('user.created')
	async handleUserCreated(@Payload() userId: string) {
		console.log('Caught user.created event!', userId);
		await this.vehiclesService.createEmptyForUser(userId);
	}

	@Post()
	create(@Body() createVehicleDto: CreateVehicleDto) {
		return this.vehiclesService.create(createVehicleDto);
	}

	// @Get()
	// findAll() {
	// 	return this.vehiclesService.findAll();
	// }

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.vehiclesService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
		return this.vehiclesService.update(id, updateVehicleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.vehiclesService.remove(id);
	}
}
