import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Investment } from 'src/db/entities/investment.entity';
import { Repository } from 'typeorm';
import { CreateInvestmentDto } from './dtos/create-investment.dto';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(Investment)
        private readonly investmentRepository: Repository<Investment>) { }

    async create(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
        const { clientId, originalAmount } = createInvestmentDto

        const investment = this.investmentRepository.create({
            clientId,
            originalAmount,
            amount: originalAmount,
        });

        return this.investmentRepository.save(investment)
    }
}
