import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class CreateInvestmentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number

  @IsDateString()
  @IsNotEmpty()
  creationDate: string
}
