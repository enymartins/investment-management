import { InvestmentDetailsDto } from 'src/investments/dtos/investment-details.dto'

export class WithdrawalDto {
  amount: number

  netValue: number

  taxRate: number

  investment: InvestmentDetailsDto
}
