import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://guest:guest@localhost:5672'],
			queue: 'user_queue',
			queueOptions: {
				durable: false
			}
		}
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	await app.startAllMicroservices();

	const port = configService.get<number>('VEHICLE_PORT') || 3002;
	await app.listen(port);

	console.log(`🚗 Vehicle API: http://localhost:${port}`);
	console.log(`🐰 Vehicle Service is listening to RabbitMQ...`);
}
bootstrap();
