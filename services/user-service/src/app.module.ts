import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

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
				host: config.get<string>('USER_DB_HOST'),
				port: config.get<number>('USER_DB_PORT'),
				username: config.get<string>('USER_DB_USER'),
				password: config.get<string>('USER_DB_PASS'),
				database: config.get<string>('USER_DB_NAME'),
				autoLoadEntities: true,
				synchronize: true // for dev
			})
		}),
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
