import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateVehicleDto {
	@IsString({ message: 'Марка має бути рядком' })
	@IsNotEmpty({ message: 'Марка обов’язкова' })
	make: string;

	@IsString({ message: 'Модель має бути рядком' })
	@IsNotEmpty({ message: 'Модель обов’язкова' })
	model: string;

	@IsInt({ message: 'Рік має бути цілим числом' })
	@Min(1900)
	@Max(new Date().getFullYear() + 1)
	@IsOptional()
	year?: number;

	@IsInt({ message: 'ID користувача має бути числом' })
	@IsNotEmpty({ message: 'ID користувача обов’язковий для прив’язки' })
	user_id: number;
}
