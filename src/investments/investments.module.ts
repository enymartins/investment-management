import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from 'src/db/entities/investment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment])],
  providers: [InvestmentsService],
  controllers: [InvestmentsController]
})
export class InvestmentsModule {}
