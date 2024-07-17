import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { InvestmentsService } from '../investments/investments.service'
import { Investment } from '../db/entities/investment.entity'
import { Withdrawal } from '../db/entities/withdrawal.entity'
import { WithdrawalsService } from './withdrawals.service'

const mockWithdrawalRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  }),
}

const mockInvestmentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest
      .fn()
      .mockResolvedValue([
        [
          new Investment({ id: '1', amount: 100 }),
          new Investment({ id: '2', amount: 100 }),
        ],
        2,
      ]),
  }),
}

const mockInvestmentsService = {
  getAllInvestments: jest.fn(),
  create: jest.fn(),
  calculateExpectedBalance: jest.fn(),
  findOneById: jest.fn(),
  updateInvestment: jest.fn(),
}
describe('WithdrawalsService', () => {
  let service: WithdrawalsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalsService,
        {
          provide: getRepositoryToken(Withdrawal),
          useValue: mockWithdrawalRepository,
        },
        {
          provide: getRepositoryToken(Investment),
          useValue: mockInvestmentRepository,
        },
        {
          provide: InvestmentsService,
          useValue: mockInvestmentsService,
        },
      ],
    }).compile()

    service = module.get<WithdrawalsService>(WithdrawalsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a withdrawal when investment exists and amount is valid', async () => {
    mockInvestmentsService.findOneById = jest.fn().mockResolvedValue({
      id: 'investmentId',
      amount: 1000,
      creationDate: new Date('2020-01-01'),
      lastUpdated: new Date(),
      lastSeen: new Date(),
      user: 'userId',
      updatedAt: new Date(),
      originalAmount: 1000,
      withdrawals: [],
    })

    const result = await service.create('investmentId', 500, 'userId')

    expect(result).toEqual({
      amount: 500,
      netValue: expect.any(Number),
      taxRate: expect.any(Number),
      investment: expect.objectContaining({
        id: 'investmentId',
        amount: 500,
      }),
    })
    expect(mockInvestmentsService.findOneById).toHaveBeenCalledWith(
      'investmentId',
      'userId',
    )
    expect(mockInvestmentRepository.save).toHaveBeenCalled()
    expect(mockWithdrawalRepository.save).toHaveBeenCalled()
  })
})
