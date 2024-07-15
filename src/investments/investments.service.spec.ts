import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UsersService } from '../users/users.service'
import { Investment } from '../db/entities/investment.entity'
import { InvestmentsService } from './investments.service'
import * as moment from 'moment'
import { User } from 'src/db/entities/user.entity'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
const investimentList: Investment[] = [
  new Investment({ id: '1', amount: 100 }),
  new Investment({ id: '2', amount: 100 }),
]

const mockInvestmentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
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

const mockUsersService = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  findByCpf: jest.fn(),
}
describe('InvestmentsService', () => {
  let service: InvestmentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestmentsService,
        {
          provide: getRepositoryToken(Investment),
          useValue: mockInvestmentRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    service = module.get<InvestmentsService>(InvestmentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return a investiment list successfully', async () => {
      const result = await service.getAllInvestments(2, '123')
      expect(result).toEqual({
        investments: investimentList,
        page: 2,
        perPage: 10,
        total: investimentList.length,
      })
    })
  })

  describe('create', () => {
    it('should create an investment with success', async () => {
      mockInvestmentRepository.create.mockReturnValue(new Investment())
      mockInvestmentRepository.save.mockResolvedValue(new Investment())
      mockUsersService.findByUserId.mockResolvedValue({ id: '1' })

      const result = await service.create(
        { amount: 100, creationDate: '2023-04-11' },
        '1',
      )

      expect(mockInvestmentRepository.create).toHaveBeenCalledWith({
        amount: service.calculateExpectedBalance(100, new Date('2023-04-11')),
        originalAmount: 100,
        creationDate: '2023-04-11',
        user: { id: '1' },
      })

      expect(mockInvestmentRepository.save).toHaveBeenCalledWith(
        new Investment(),
      )
      expect(result).toEqual(new Investment())
    })
  })

  describe('calculateExpectedBalance', () => {
    it('should calculate expected balance for a given amount and creation date', () => {
      const amount = 1000
      const creationDate = moment().subtract(30, 'days').toDate()
      const monthlyRate = 0.0052
      const daysInMonth = moment(creationDate).daysInMonth()
      const expectedBalance =
        amount * Math.pow(1 + monthlyRate / daysInMonth, 30)

      const result = service.calculateExpectedBalance(amount, creationDate)

      expect(result).toBeCloseTo(expectedBalance, 2)
    })

    it('should calculate expected balance correctly for different amounts and dates', () => {
      const amount = 500
      const creationDate = moment().subtract(15, 'days').toDate()
      const monthlyRate = 0.0052
      const daysInMonth = moment(creationDate).daysInMonth()
      const expectedBalance =
        amount * Math.pow(1 + monthlyRate / daysInMonth, 15)

      const result = service.calculateExpectedBalance(amount, creationDate)

      expect(result).toBeCloseTo(expectedBalance, 2)
    })
  })

  describe('updateInvestment', () => {
    it('should not update investment when no withdrawals since last update', async () => {
      const creationDate = new Date(Date.now())
      const updatedAt = new Date()
      const lastUpdated = new Date(Date.now())
      const lastSeen = new Date()
      lastSeen.setHours(0, 0, 0, 0)

      const investment = {
        amount: 100,
        originalAmount: 100,
        lastSeen,
        creationDate,
        lastUpdated,
        updatedAt,
        withdrawals: [],
        id: '1',
        user: { id: '1' } as unknown as User,
      }

      const result = await service.updateInvestment(investment)

      expect(mockInvestmentRepository.save).toHaveBeenCalledWith({
        amount: 100,
        creationDate,
        id: '1',
        lastSeen,
        lastUpdated,
        originalAmount: 100,
        updatedAt,
        user: { id: '1' },
        withdrawals: [],
      })

      expect(result).toEqual({
        id: '1',
        amount: 100,
        creationDate,
        expectedBalance: 100,
        lastSeen,
        lastUpdated,
        originalAmount: 100,
        updatedAt,
        user: { id: '1' },
        withdrawals: [],
      })
    })

    it('should get investment by current amount when withdrawals have occurred', async () => {
      const creationDate = new Date(Date.now())
      const updatedAt = new Date()
      const lastUpdated = new Date('2024-04-28')
      const lastSeen = new Date()
      lastSeen.setHours(0, 0, 0, 0)

      const withdrawals = [
        { amount: 20, updatedAt: new Date() },
      ] as Withdrawal[]

      const investment = {
        amount: 80,
        originalAmount: 100,
        lastSeen,
        creationDate,
        lastUpdated,
        updatedAt,
        withdrawals,
        id: '1',
        user: { id: '1' } as unknown as User,
      }

      const result = await service.updateInvestment(investment)

      expect(mockInvestmentRepository.save).toHaveBeenCalledWith({
        amount: 80,
        creationDate,
        id: '1',
        lastSeen,
        lastUpdated: expect.any(Date),
        originalAmount: 100,
        updatedAt,
        user: { id: '1' },
        withdrawals: [
          {
            amount: 20,
            updatedAt,
          },
        ],
      })

      expect(result.amount).toBe(80)
    })
  })
})
