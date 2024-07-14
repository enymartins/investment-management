import * as cron from 'node-cron';
import { Injectable } from '@nestjs/common';
import { InvestmentsService } from '../investments/investments.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly investmentsService: InvestmentsService) {
    cron.schedule('* * * * *', async () => {
      console.log('Atualizando valores dos investimentos diariamente...');
      try {
        await this.investmentsService.updateInvestmentsValues();
      } catch (error) {
        console.error('Erro ao atualizar investimentos:', error);
      }
    })
  }
}
