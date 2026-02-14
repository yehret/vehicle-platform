import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail({}, { message: 'Введіть коректний email' })
	@IsNotEmpty({ message: 'Email є обов’язковим полем' })
	email: string;

	@IsString()
	@MinLength(2, { message: 'Ім’я має бути не коротше за 2 символи' })
	firstName?: string;

	@IsString()
	lastName?: string;
}
