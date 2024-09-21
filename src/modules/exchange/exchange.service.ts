import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { ExchangeRateEntity } from '../../database/entities/exchangeRate.entity';
import { BankCurService } from './services/BankCurService';
import { ExchangeRateRepository } from '../repository/services/exchangeRate.repository';

@Injectable()
export class ExchangeRateService {
  constructor(
    private bankCurService: BankCurService,
    private exchangeRateRepository: ExchangeRateRepository,
  ) {}

  @Cron('0 0 * * *')
  async updateExchangeRates() {
    const rates = await this.bankCurService.getExchangeRates();
    for (const rate of rates) {
      const exchangeRate = new ExchangeRateEntity();
      exchangeRate.currency = rate.ccy;
      exchangeRate.rate = rate.buy;
      exchangeRate.date = new Date();
      await this.exchangeRateRepository.save(exchangeRate);
    }
  }
}
