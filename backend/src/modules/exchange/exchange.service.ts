import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { BankCurService } from './services/BankCurService';

@Injectable()
export class ExchangeRateService {
  constructor(private bankCurService: BankCurService) {}

  @Cron('0 0 * * *')
  async updateExchangeRates(): Promise<{ eur: number; usd: number }> {
    return await this.bankCurService.getExchangeRates();
  }
}
