import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	// @Get('me')
	// async getMe(@Req() req: Request) {
	// 	const userId = (req.session as Record<string, any>).userId;

	// 	if (!userId) {
	// 		throw new UnauthorizedException('Ви не авторизовані');
	// 	}

	// 	return this.usersService.me(userId);
	// }
}
