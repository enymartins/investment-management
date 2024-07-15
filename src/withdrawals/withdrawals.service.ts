import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { InvestmentsService } from 'src/investments/investments.service'
import { Repository } from 'typeorm'
import { WithdrawalDto } from './dtos/withdrawal.dto'

@Injectable()
export class WithdrawalsService {
    constructor(
        @InjectRepository(Investment)
        private readonly investmentRepository: Repository<Investment>,
        @InjectRepository(Withdrawal)
        private readonly withdrawalRepository: Repository<Withdrawal>,
        private readonly invesmentsService: InvestmentsService,
    ) { }

    async create(investmentId: string, amount: number, userId: string): Promise<WithdrawalDto> {
        const investment = await this.invesmentsService.findOneById(investmentId, userId)

        if (!investment) {
            throw new NotFoundException('Investment not found')
        }

        if (amount > investment.amount) {
            throw new BadRequestException('Insufficient funds')
        }

        const remainingAmount = investment.amount - amount
        investment.amount = remainingAmount

        const creationDate = investment.creationDate
        const currentDate = new Date()
        const ageInYears =
            (currentDate.getTime() - creationDate.getTime()) /
            (1000 * 3600 * 24 * 365)

        const taxRate = this.calculateTaxRate(ageInYears)

        const netAmount = this.calculateNetValue(amount, taxRate)

        const withdrawal = new Withdrawal()
        withdrawal.amount = amount
        withdrawal.netValue = netAmount
        withdrawal.taxRate = taxRate
        withdrawal.investment = investment

        investment.lastUpdated = withdrawal.updatedAt // Supondo que updatedAt do saque seja automaticamente definido pelo ORM
        await this.investmentRepository.save(investment)

        await this.withdrawalRepository.save(withdrawal)
        return {
            amount: withdrawal.amount,
            netValue: withdrawal.netValue,
            taxRate: withdrawal.netValue,
            investment: {
                id: investment.id,
                lastUpdated: investment.lastUpdated,
                lastSeen: investment.lastSeen,
                user: investment.user,
                updatedAt: investment.updatedAt,
                originalAmount: investment.originalAmount,
                amount: investment.amount,
                creationDate: investment.creationDate,
                withdrawals: investment.withdrawals,
            },
        }
    }

    async findByInvestment(investmentId: string, userId: string): Promise<Withdrawal[]> {
        const withdrawal = await this.withdrawalRepository.find({
            where: { investment: { id: investmentId, user: { id: userId } } },
            relations: ['investment']
        })

        if (withdrawal.length === 0) {
            throw new NotFoundException(`Investment with ID ${investmentId} was not found`)
        }

        return withdrawal
    }
    private calculateTaxRate(ageInYears: number): number {
        if (ageInYears < 1) {
            return 0.225
        } else if (ageInYears >= 1 && ageInYears < 2) {
            return 0.185
        } else {
            return 0.15
        }
    }

    private calculateNetValue(amount: number, taxRate: number): number {
        const taxAmount = amount * taxRate
        return amount - taxAmount
    }
}
