import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const userId = request.session?.userId;

		if (!userId) {
			throw new UnauthorizedException('User not authorized');
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: userId }
		});

		if (!user) {
			throw new UnauthorizedException('User not found, session expired');
		}

		request.user = user;

		return true;
	}
}
