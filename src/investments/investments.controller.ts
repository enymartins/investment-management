import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { Investment } from 'src/db/entities/investment.entity'
import { CreateInvestmentDto } from './dtos/create-investment.dto'
import { InvestmentsService } from './investments.service'
@UseGuards(AuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) { }

  @Post()
  async createInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    userId: string,
  ): Promise<Investment> {
    return this.investmentsService.create(createInvestmentDto, userId)
  }
}
