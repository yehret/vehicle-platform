import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto, @Headers('user-agent') userAgent: string) {
		return this.authService.login(req, dto, userAgent);
	}

	// @Post('logout')
	// @HttpCode(HttpStatus.OK)
	// public async logout(@Req() req: Request) {
	// 	return this.authService.logout(req);
	// }
}
