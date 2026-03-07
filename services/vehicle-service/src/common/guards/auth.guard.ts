import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();

		const userId = request.session?.userId;

		if (!userId) {
			throw new UnauthorizedException('Користувач не авторизований у системі');
		}

		request['userId'] = userId;

		return true;
	}
}
