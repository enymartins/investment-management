import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/db/entities/user.entity'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'

export class InvestmentDetailsDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  originalAmount: number

  @ApiProperty()
  amount: number

  @ApiProperty()
  expectedBalance?: number

  @ApiProperty()
  creationDate: Date

  @ApiProperty()
  lastUpdated: Date

  user: User

  updatedAt: Date

  lastSeen: Date

  @ApiProperty()
  withdrawals: Withdrawal[]
}
