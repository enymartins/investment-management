import { IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  cpf: string

  @IsNotEmpty()
  password: string
}
