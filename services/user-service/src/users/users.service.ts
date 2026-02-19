import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly prismaService: PrismaService,
		@Inject('USER_SERVICE') private client: ClientProxy
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			}
		});

		return user;
	}

	public async create(input: CreateUserDto) {
		const { email, password, firstName, lastName } = input;

		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});

		if (isEmailExists) {
			throw new Error('Email already exists');
		}

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await this.prismaService.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName
			}
		});

		this.client.emit('user.created', user.id);

		return true;
	}

	// Change email

	// Change password
}
