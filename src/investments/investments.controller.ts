import { Body, Controller, Post } from '@nestjs/common';
import { Investment } from 'src/db/entities/investment.entity';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { InvestmentsService } from './investments.service';

@Controller('investments')
export class InvestmentsController {
    constructor(
        private readonly investmentsService: InvestmentsService
    ){}

    @Post()
    async createInvestment(@Body() createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
        return this.investmentsService.create(createInvestmentDto);
    }
}
