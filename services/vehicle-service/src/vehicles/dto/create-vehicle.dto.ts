import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
	@IsString()
	@IsNotEmpty()
	make: string;

	@IsString()
	@IsNotEmpty()
	model: string;

	@IsInt()
	@Min(1900)
	@Max(new Date().getFullYear() + 1)
	@IsOptional()
	year?: number;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
