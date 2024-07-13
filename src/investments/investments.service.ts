import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as moment from 'moment'
import { Investment } from 'src/db/entities/investment.entity'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { InvestmentDetailsDto } from './dtos/investment-details.dto'
import { CreateInvestmentDto } from './dtos/create-investment.dto'

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createInvestmentDto: CreateInvestmentDto,
    userId: string,
  ): Promise<Investment> {
    const { amount, creationDate } = createInvestmentDto

    const user = await this.usersService.findByUserId(userId)

    const newInvestment = this.investmentRepository.create({
      amount,
      originalAmount: amount,
      user,
      creationDate,
    })

    return this.investmentRepository.save(newInvestment)
  }

  async findOneById(id: string): Promise<InvestmentDetailsDto> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    })
    const expectedBalance = await this.calculateExpectedBalance(
      investment,
      new Date(),
    )

    return {
      id: investment.id,
      originalAmount: investment.originalAmount,
      creationDate: investment.creationDate,
      expectedBalance: expectedBalance,
    }
  }

  async calculateExpectedBalance(
    investment: Investment,
    currentDate: Date,
  ): Promise<number> {
    const creationDate = moment(investment.creationDate)
    const currentMoment = moment(currentDate)

    const daysDiff = currentMoment.diff(creationDate, 'days')

    const daysInMonth = creationDate.daysInMonth()

    const monthlyReturnRate = 0.0052
    const dailyReturnRate = monthlyReturnRate / daysInMonth

    const expectedBalance =
      investment.originalAmount * Math.pow(1 + dailyReturnRate, daysDiff)

    return parseFloat(expectedBalance.toFixed(2))
  }
}
