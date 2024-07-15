import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserOutputDto } from './dtos/user-output.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a New User' })
  @ApiBody({
    description: 'User data',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Example user data creation',
        value: {
          name: "Ana Silva",
          email: "email@email.com",
          cpf: "024.268.910-84",
          password: "1234567"
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createUser(@Body() createUser: CreateUserDto): Promise<UserOutputDto> {
    return this.usersService.create(createUser)
  }
}
