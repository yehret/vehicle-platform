import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto, @Headers('user-agent') userAgent: string) {
		return this.authService.login(req, dto, userAgent);
	}

	@Get('me')
	@UseGuards(AuthGuard)
	public async getMe(@Req() req: Request) {
		return this.authService.getMe(req);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	public async logout(@Req() req: Request) {
		return this.authService.logout(req);
	}
}
