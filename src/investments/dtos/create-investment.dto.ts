import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateInvestmentDto {
    @IsNumber()
    @IsPositive()
    amount: number
  
    @IsDateString()
    creationDate: string
  }