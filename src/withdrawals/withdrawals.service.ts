import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { Repository } from 'typeorm'

@Injectable()
export class WithdrawalsService {
    constructor(
        @InjectRepository(Investment)
        private readonly investmentRepository: Repository<Investment>,
        @InjectRepository(Withdrawal)
        private readonly withdrawalRepository: Repository<Withdrawal>,
    ) { }

    async create(investmentId: string, amount: number): Promise<Withdrawal> {
        const investment = await this.investmentRepository.findOne({
            where: { id: investmentId },
        })

        if (!investment) {
            throw new NotFoundException('Investment not found')
        }

        if (amount > investment.amount) {
            throw new BadRequestException('Insufficient funds');
          }

        const remainingAmount = investment.amount - amount;
        investment.amount = remainingAmount;

        const creationDate = investment.creationDate;
        const currentDate = new Date();
        const ageInYears = (currentDate.getTime() - creationDate.getTime()) / (1000 * 3600 * 24 * 365);

        const taxRate = this.calculateTaxRate(ageInYears);

        const netAmount = this.calculateNetValue(amount, taxRate);

        const withdrawal = new Withdrawal();
        withdrawal.amount = amount;
        withdrawal.netValue = netAmount;
        withdrawal.taxRate = taxRate;
        withdrawal.investment = investment;

        await this.investmentRepository.save(investment);

        return await this.withdrawalRepository.save(withdrawal);
    }

    async findByInvestment(investmentId: string): Promise<Withdrawal[]> {
        return this.withdrawalRepository.find({
            where: { investment: { id: investmentId } },
        })
    }
    private calculateTaxRate(ageInYears: number): number {
        if (ageInYears < 1) {
            return 0.225;
        } else if (ageInYears >= 1 && ageInYears < 2) {
            return 0.185;
        } else {
            return 0.15;
        }
    }

    private calculateNetValue(amount: number, taxRate: number): number {
        const taxAmount = amount * taxRate;
        return amount - taxAmount;
    }
}
