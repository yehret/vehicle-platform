import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get('me')
	@UseGuards(AuthGuard)
	async getMe(@Req() req: Request) {
		const userId = req.session.userId;
		if (!userId) throw new UnauthorizedException('Ви не авторизовані');
		return this.usersService.findOne(userId);
	}

	@Get()
	async findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard, OwnerGuard)
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, OwnerGuard)
	async remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
