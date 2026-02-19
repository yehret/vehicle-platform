import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '../../.env'
		}),
		PrismaModule,
		VehiclesModule
	]
})
export class AppModule {}
