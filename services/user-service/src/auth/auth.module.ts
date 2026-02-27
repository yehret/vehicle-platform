import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { OwnerGuard } from './guards/owner.guard';

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, OwnerGuard],
	exports: [AuthGuard, OwnerGuard]
})
export class AuthModule {}
