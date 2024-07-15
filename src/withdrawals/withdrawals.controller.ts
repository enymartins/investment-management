import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { CreateWithdrawalDto } from './dtos/create-withdrawal.dto'
import { WithdrawalDto } from './dtos/withdrawal.dto'
import { WithdrawalsService } from './withdrawals.service'

@ApiTags('Withdrawals')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) { }

  @Post(':investmentId')
  @ApiOperation({ summary: 'Details of the withdrawal to be created' })
  @ApiBody({
    description: 'Details of the investment to be created',
    type: CreateWithdrawalDto,
    examples: {
      example1: {
        summary: 'Example withdrawal creation',
        value: {
          amount: 10
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The withdrawal has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiOperation({ summary: 'View a withdrawal from a specific investment' })
  async findByInvestment(
    @Param('investmentId') investmentId: string,
    @Req() req
  ): Promise<Withdrawal[]> {
    const userId = req.user.sub
    return this.withdrawalsService.findByInvestment(investmentId, userId)
  }
}
