import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../db/entities/user.entity'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserDto } from './dtos/user.dto'
import { hashSync as bcryptHashSync } from 'bcrypt'
import { UserOutputDto } from './dtos/user-output.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserOutputDto> {
    const normalizedCpf = this.normalizeCpf(createUserDto.cpf)
    const user = await this.findByCpf(normalizedCpf)

    if (user) {
      throw new ConflictException(
        `User ${user.name} with cpf ${user.cpf} already exists. Do login to access your account`,
      )
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: bcryptHashSync(createUserDto.password, 10),
      cpf: normalizedCpf,
    })
    await this.userRepository.save(newUser)

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      cpf: newUser.cpf,
    }
  }

  private normalizeCpf(cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  async findByUserId(id: string): Promise<UserOutputDto> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`)
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
    }
  }

  async findByCpf(cpf: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { cpf },
    })

    return user
  }
}
