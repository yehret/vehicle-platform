import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ClientsModule.registerAsync([
			{
				name: 'USER_SERVICE',
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@localhost:5672'],
						queue: 'user_queue',
						queueOptions: {
							durable: false
						}
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	controllers: [UsersController],
	providers: [UsersService]
})
export class UsersModule {}
