import { ApiProperty } from '@nestjs/swagger'

export class InvestmentDetailsDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  originalAmount: number

  @ApiProperty()
  amount: number

  @ApiProperty()
  expectedBalance: number

  @ApiProperty()
  creationDate: Date
}
