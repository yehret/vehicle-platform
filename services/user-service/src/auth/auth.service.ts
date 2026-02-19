import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { getSessionMetadata } from 'src/common/utils/session-metadata.util';
import { saveSession } from 'src/common/utils/session.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService
	) {}

	public async login(req: Request, input: LoginDto, userAgent: string) {
		const { email, password } = input;
		const user = await this.prismaService.user.findFirst({
			where: {
				email
			}
		});

		if (!user) throw new NotFoundException('User not found');

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) throw new UnauthorizedException('Invalid credentials');

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata);
	}
}
