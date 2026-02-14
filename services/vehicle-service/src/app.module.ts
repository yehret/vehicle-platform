import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '../.env'
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get<string>('VEHICLE_DB_HOST'),
				port: config.get<number>('VEHICLE_DB_PORT'),
				username: config.get<string>('VEHICLE_DB_USER'),
				password: config.get<string>('VEHICLE_DB_PASS'),
				database: config.get<string>('VEHICLE_DB_NAME'),
				entities: [Vehicle],
				synchronize: true // for dev
			})
		}),
		VehiclesModule
	]
})
export class AppModule {}
