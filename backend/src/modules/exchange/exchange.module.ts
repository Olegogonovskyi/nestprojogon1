import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange.service';
import { HttpModule } from '@nestjs/axios';
import { BankCurService } from './services/BankCurService';

@Module({
  imports: [HttpModule],
  providers: [ExchangeRateService, BankCurService],
  exports: [ExchangeRateService],
})
export class ExchangeModule {}
