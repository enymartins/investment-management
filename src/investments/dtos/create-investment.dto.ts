import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateInvestmentDto {
    @IsNotEmpty()
    clientId: string
  
    @IsNumber()
    @IsPositive()
    originalAmount: number

    @IsNumber()
    @IsPositive()
    amount: number
  
    @IsDateString()
    creationDate: string
  }