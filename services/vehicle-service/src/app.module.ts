import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
	imports: [
		PrometheusModule.register({ path: '/metrics' }),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '../../.env'
		}),
		RedisModule,
		PrismaModule,
		VehiclesModule
	]
})
export class AppModule {}
