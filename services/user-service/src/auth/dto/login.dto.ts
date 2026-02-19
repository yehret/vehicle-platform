import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	public email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string;
}
