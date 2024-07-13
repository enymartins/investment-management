import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthResponseDto } from './dtos/auth.dto'
import { LoginDto } from './dtos/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(loginDto)
  }
}
