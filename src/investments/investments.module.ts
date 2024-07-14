import { Module } from '@nestjs/common'
import { InvestmentsService } from './investments.service'
import { InvestmentsController } from './investments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Investment]), UsersModule],
  providers: [InvestmentsService],
  controllers: [InvestmentsController],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
