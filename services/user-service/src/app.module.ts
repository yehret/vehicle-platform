import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '../../.env'
		}),
		RedisModule,
		PrismaModule,
		UsersModule,
		AuthModule
	],
	controllers: [],
	providers: [],
	exports: []
})
export class AppModule {}
