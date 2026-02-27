import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OwnerGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const request = ctx.switchToHttp().getRequest<Request>();

		const sessionUserId = request.session?.userId;
		const paramId = request.params.id;

		if (!sessionUserId) {
			return false;
		}

		if (sessionUserId !== paramId) {
			throw new ForbiddenException('Permission denied');
		}

		return true;
	}
}
