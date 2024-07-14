import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { Withdrawal } from 'src/db/entities/withdrawal.entity'
import { WithdrawalsController } from './withdrawals.controller'
import { WithdrawalsService } from './withdrawals.service'

@Module({
  imports: [TypeOrmModule.forFeature([Investment, Withdrawal])],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
  exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
