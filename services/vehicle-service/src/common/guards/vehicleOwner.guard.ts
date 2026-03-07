import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { VehiclesService } from '../../vehicles/vehicles.service';

@Injectable()
export class VehicleOwnerGuard implements CanActivate {
	constructor(private readonly vehiclesService: VehiclesService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userId = request.session.userId;
		const vehicleId = request.params.id;

		const vehicle = await this.vehiclesService.findOne(vehicleId);

		if (!vehicle) {
			throw new NotFoundException('Not found');
		}

		if (vehicle.userId !== userId) {
			throw new ForbiddenException('Access forbidden');
		}

		return true;
	}
}
