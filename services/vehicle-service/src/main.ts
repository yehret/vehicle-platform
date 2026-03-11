import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import session from 'express-session';
import { AppModule } from './app.module';
import { RedisService } from './common/redis/redis.service';

async function bootstrap() {
	const connectRedis = require('connect-redis');
	const RedisStore = connectRedis.RedisStore || connectRedis.default || connectRedis;

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	const configService = app.get(ConfigService);
	const redisClient = app.get(RedisService);

	app.enableCors({
		origin: configService.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type, Accept, Authorization'
	});

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

	app.use(
		session({
			secret: configService.getOrThrow<string>('SESSION_SECRET'),
			name: configService.getOrThrow<string>('SESSION_NAME') || 'sid',
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: configService.get<string>('SESSION_DOMAIN'),
				maxAge: 3600000,
				httpOnly: true,
				secure: configService.get<string>('NODE_ENV') === 'production',
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redisClient,
				prefix: 'auth:'
			})
		})
	);

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

	await app.startAllMicroservices();

	const port = configService.get<number>('VEHICLE_PORT') || 3002;
	await app.listen(port);

	console.log(`🚗 Vehicle API: http://localhost:${port}`);
	console.log(`🐰 Vehicle Service is listening to RabbitMQ...`);
}
bootstrap();
