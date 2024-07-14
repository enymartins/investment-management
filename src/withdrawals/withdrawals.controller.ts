import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto'
import { WithdrawalsService } from './withdrawals.service'

@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post(':investmentId')
  async create(
    @Param('investmentId') investmentId: string,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ): Promise<Withdrawal> {
    return this.withdrawalsService.create(
      investmentId,
      createWithdrawalDto.amount,
    )
  }

  @Get(':investmentId')
  async findByInvestment(
    @Param('investmentId') investmentId: string,
  ): Promise<Withdrawal[]> {
    return this.withdrawalsService.findByInvestment(investmentId)
  }
}
