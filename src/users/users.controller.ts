import { Body, Controller, Post } from '@nestjs/common'
import { User } from 'src/db/entities/user.entity'
import { CreateUserDto } from './dtos/user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<User> {
    return this.usersService.create(createUser)
  }
}
