import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

	public async findAll() {
		return this.prismaService.user.findMany({
			select: { id: true, email: true, firstName: true, lastName: true, createdAt: true }
		});
	}

	public async findOne(id: string) {
		const user = await this.prismaService.user.findUnique({ where: { id } });
		if (!user) throw new NotFoundException('Користувача не знайдено');

		const { password: _password, ...result } = user;
		return result;
	}

	public async update(id: string, dto: UpdateUserDto) {
		if (dto.password) {
			const salt = await bcrypt.genSalt();
			dto.password = await bcrypt.hash(dto.password, salt);
		}

		const user = await this.prismaService.user.update({
			where: { id },
			data: dto
		});

		this.client.emit('user.updated', { id: user.id, ...dto });

		const { password: _password, ...result } = user;
		return result;
	}

	public async remove(id: string) {
		await this.prismaService.user.delete({ where: { id } });

		this.client.emit('user.deleted', id);

		return true;
	}
}
