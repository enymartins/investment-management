import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../db/entities/user.entity'
import { CreateUserDto } from './dtos/user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const normalizedCpf = this.normalizeCpf(createUserDto.cpf)
    const user = await this.userRepository.findOne({
      where: { cpf: normalizedCpf },
    })
    if (user) {
      throw new ConflictException(
        `User ${user.name} with cpf ${user.cpf} already exists. Do login to access your account`,
      )
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      cpf: normalizedCpf,
    })
    return this.userRepository.save(newUser)
  }

  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  async findByUserId(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`)
    }
    return user
  }
}
