import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service'
import { AuthResponseDto } from './dtos/auth.dto'
import { LoginDto } from './dtos/login.dto'
import { compareSync as bcryptCompareSync } from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private jwtExpirationInSeconds: number
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationInSeconds =
      +this.configService.get<number>('JWT_EXPIRES_IN')
  }

  async signIn(loginDto: LoginDto): Promise<AuthResponseDto> {
    const foundUser = await this.usersService.findByCpf(loginDto.cpf)

    if (
      !foundUser ||
      !bcryptCompareSync(loginDto.password, foundUser.password)
    ) {
      throw new UnauthorizedException()
    }

    const payload = { sub: foundUser.id, cpf: foundUser.cpf }
    const token = this.jwtService.sign(payload)
    return { token, expiresIn: this.jwtExpirationInSeconds }
  }
}
