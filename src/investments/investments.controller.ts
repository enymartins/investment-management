import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Investment } from 'src/db/entities/investment.entity'
import { InvestmentDetailsDto } from './dtos/investment-details.dto'
import { CreateInvestmentDto } from './dtos/create-investment.dto'
import { InvestmentsService } from './investments.service'

@ApiTags('investments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get(':id')
  async getInvestmentDetails(
    @Param('id') id: string,
  ): Promise<InvestmentDetailsDto> {
    const investment = await this.investmentsService.findOneById(id)
    return investment
  }

  @Post()
  @ApiOperation({ summary: 'Criar Investimento' })
  async createInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @Req() req,
  ): Promise<Investment> {
    const userId = req.user.sub
    return this.investmentsService.create(createInvestmentDto, userId)
  }
}
