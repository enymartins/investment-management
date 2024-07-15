import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'

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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ): Promise<InvestmentDetailsDto> {
    const userId = req.user.sub;
    const investment = await this.investmentsService.findOneById(id, userId)
    return investment
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getInvestments(
    @Query('page') page = 1,
    @Req() req,
    @Query('status') status?: string,
  ) {
    const userId = req.user.sub;
    return this.investmentsService.getAllInvestments(page, userId)
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
