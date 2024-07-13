import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
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
    const { amount } = createInvestmentDto

    const user = await this.usersService.findByUserId(userId)

    const newInvestment = this.investmentRepository.create({
      amount,
      originalAmount: amount,
      user,
    })

    return this.investmentRepository.save(newInvestment)
  }
}
