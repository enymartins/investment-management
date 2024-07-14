import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment'
import { Investment } from 'src/db/entities/investment.entity'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { InvestmentDetailsDto } from './dtos/investment-details.dto'
import { CreateInvestmentDto } from './dtos/create-investment.dto'

@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name)
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    private readonly usersService: UsersService,
  ) {}

  async getAllInvestments(page: number, status?: string) {
    const perPage = 10
    const skip = (page - 1) * perPage

    const query = this.investmentRepository.createQueryBuilder('investment')

    //TODO: ADD status active/inactive
    // if (status) {
    //   query = query.where('investment.status = :status', { status })

    // }

    this.logger.debug(`Executing query for page ${page}`)
    const [investments, total] = await query
      .orderBy('investment.updatedAt', 'DESC')
      .skip(skip)
      .take(perPage)
      .getManyAndCount()

    const result = {
      investments,
      total,
      page,
      perPage,
    }
    return result
  }

  async create(
    createInvestmentDto: CreateInvestmentDto,
    userId: string,
  ): Promise<Investment> {
    const { amount, creationDate } = createInvestmentDto

    const user = await this.usersService.findByUserId(userId)

    const expectedBalance = await this.calculateExpectedBalance(
      amount,
      new Date(creationDate),
    )

    const newInvestment = this.investmentRepository.create({
      amount: expectedBalance,
      originalAmount: amount,
      user,
      creationDate,
    })

    return this.investmentRepository.save(newInvestment)
  }

  calculateExpectedBalance(amount: number, creationDate: Date): number {
    const currentMoment = moment()
    const daysDiff = currentMoment.diff(moment(creationDate), 'days')
    const daysInMonth = moment(creationDate).daysInMonth()
    const monthlyReturnRate = 0.0052
    const dailyReturnRate = monthlyReturnRate / daysInMonth

    const expectedBalance = amount * Math.pow(1 + dailyReturnRate, daysDiff)
    return parseFloat(expectedBalance.toFixed(2))
  }

  async findOneById(id: string): Promise<InvestmentDetailsDto> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: ['withdrawals'],
    })

    const updatedInvestment = this.updateInvestment(investment)
    return updatedInvestment
  }

  async updateInvestment(
    investment: Investment,
  ): Promise<InvestmentDetailsDto> {
    const amount =
      typeof investment.amount === 'string'
        ? parseFloat(investment.amount)
        : investment.amount
    const originalAmount =
      typeof investment.originalAmount === 'string'
        ? parseFloat(investment.originalAmount)
        : investment.originalAmount

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastSeen = investment.lastSeen
      ? new Date(investment.lastSeen)
      : new Date(investment.creationDate)
    lastSeen.setHours(0, 0, 0, 0)
    const needRecalculation =
      investment.withdrawals.some(
        (withdrawal) => withdrawal.updatedAt > investment.lastUpdated,
      ) || investment.lastSeen < today

    if (needRecalculation) {
      if (investment.updatedAt > investment.lastUpdated) {
        if (investment.withdrawals.length <= 0) {
          investment.amount = this.calculateExpectedBalance(
            investment.originalAmount,
            investment.creationDate,
          )
        } else {
          investment.amount = this.calculateExpectedBalance(
            investment.amount,
            investment.creationDate,
          )
        }
        investment.lastUpdated = new Date()
        investment.lastSeen = today
        await this.investmentRepository.save({
          ...investment,
          amount: investment.amount,
        })
      }
    }
    return {
      id: investment.id,
      lastUpdated: investment.lastUpdated,
      lastSeen,
      user: investment.user,
      updatedAt: investment.updatedAt,
      originalAmount,
      creationDate: investment.creationDate,
      expectedBalance: amount,
      amount,
      withdrawals: investment.withdrawals,
    }
  }
}
