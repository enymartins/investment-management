import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthResponseDto } from './dtos/auth.dto'
import { LoginDto } from './dtos/login.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    description: 'Login data',
    examples: {
      example1: {
        summary: 'Login example',
        value: {
          cpf: "02426891084",
          password: "1234567"
        },
      },
    },
  })
  async signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(loginDto)
  }
}
