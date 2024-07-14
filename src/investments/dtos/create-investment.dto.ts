import { IsDateString, IsNotEmpty, IsNumber, IsPositive, Matches } from 'class-validator'

export class CreateInvestmentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number

  @IsDateString() //2023-04-11
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "creationDate must match format YYYY/MM/DD"})
  creationDate: string
}
