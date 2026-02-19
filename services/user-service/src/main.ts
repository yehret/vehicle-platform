import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import Redis from 'ioredis';
import passport from 'passport';
import { AppModule } from './app.module';
import { RedisService } from './common/redis/redis.service';

async function bootstrap() {
	const connectRedis = require('connect-redis');
	const RedisStore = connectRedis.RedisStore || connectRedis.default || connectRedis;

	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);

	const redisClient: Redis = app.get(RedisService);

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	);

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME') || 'sid',
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.get<string>('SESSION_DOMAIN'),
				maxAge: 3600000,
				httpOnly: true,
				secure: config.get<string>('NODE_ENV') === 'production',
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: {
					get: (key: string): Promise<string | null> => redisClient.get(key),

					del: (key: string): Promise<number> => redisClient.del(key),

					set: (key: string, value: string, options?: { EX?: number }): Promise<string | null> => {
						if (options?.EX) {
							return redisClient.set(key, value, 'EX', options.EX);
						}
						return redisClient.set(key, value);
					},
					expire: (key: string, ttl: number): Promise<number> => redisClient.expire(key, ttl)
				},
				prefix: 'auth:'
			})
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	const port = config.get<number>('USER_PORT') || 3001;
	await app.listen(port);

	console.log(`Prisma is running on: http://localhost:${port}`);
}
bootstrap();
