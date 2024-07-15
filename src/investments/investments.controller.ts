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

import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Investment } from 'src/db/entities/investment.entity'
import { InvestmentDetailsDto } from './dtos/investment-details.dto'
import { CreateInvestmentDto } from './dtos/create-investment.dto'
import { InvestmentsService } from './investments.service'

@ApiTags('Investments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) { }

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
  @ApiOperation({ summary: 'Get all investments' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination', example: 1 })
  async getInvestments(
    @Query('page') page = 1,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.investmentsService.getAllInvestments(page, userId)
  }

  @Post()
  @ApiOperation({ summary: 'Create a New Investment' })
  @ApiBody({
    description: 'Details of the investment to be created',
    type: CreateInvestmentDto,
    examples: {
      example1: {
        summary: 'Example investment creation',
        value: {
          amount: 100,
          creationDate: '2023-04-11',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The investment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @Req() req,
  ): Promise<Investment> {
    const userId = req.user.sub
    return this.investmentsService.create(createInvestmentDto, userId)
  }
}
