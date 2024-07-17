import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { InvestmentsService } from './investments.service'
import { InvestmentsController } from './investments.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Investment } from 'src/db/entities/investment.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Investment]),
    UsersModule,
    CacheModule.register(),
  ],
  providers: [InvestmentsService],
  controllers: [InvestmentsController],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
