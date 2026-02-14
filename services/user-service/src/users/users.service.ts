import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		@Inject('USER_SERVICE') private client: ClientProxy
	) {}

	async create(createUserDto: CreateUserDto) {
		const newUser = this.usersRepository.create(createUserDto);
		const savedUser = await this.usersRepository.save(newUser);

		this.client.emit('user_created', {
			type: 'USER_CREATED',
			data: {
				id: savedUser.id,
				email: savedUser.email
			}
		});

		return savedUser;
	}

	findAll() {
		return this.usersRepository.find();
	}

	findOne(id: number) {
		return this.usersRepository.findOneBy({ id });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		await this.usersRepository.update(id, updateUserDto);
		return this.findOne(id);
	}

	remove(id: number) {
		return this.usersRepository.delete(id);
	}
}
