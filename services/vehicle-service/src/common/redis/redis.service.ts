import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
	constructor(private readonly configService: ConfigService) {
		super({
			host: configService.get<string>('REDIS_HOST') || 'localhost',
			port: configService.get<number>('REDIS_PORT') || 6379,
			password: configService.get<string>('REDIS_PASSWORD')
		});
	}

	onModuleInit() {
		this.on('connect', () => {
			console.log('Redis connected');
		});

		this.on('error', err => {
			console.error('Redis connection error:', err);
		});
	}

	onModuleDestroy() {
		this.disconnect();
	}
}
