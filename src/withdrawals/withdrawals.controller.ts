import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto'
import { WithdrawalDto } from './dtos/withdrawal.dto'
import { WithdrawalsService } from './withdrawals.service'

@ApiTags('withdrawals')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post(':investmentId')
  async create(
    @Param('investmentId') investmentId: string,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    @Req() req
  ): Promise<WithdrawalDto> {
    const userId = req.user.sub
    return this.withdrawalsService.create(
      investmentId,
      createWithdrawalDto.amount,
      userId
    )
  }

  @Get(':investmentId')
  async findByInvestment(
    @Param('investmentId') investmentId: string,
  ): Promise<Withdrawal[]> {
    return this.withdrawalsService.findByInvestment(investmentId)
  }
}
