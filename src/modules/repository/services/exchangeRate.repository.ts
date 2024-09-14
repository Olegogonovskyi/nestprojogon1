import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExchangeRateEntity } from '../../../database/entities/exchangeRate.entity';

@Injectable()
export class ExchangeRateRepository extends Repository<ExchangeRateEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ExchangeRateEntity, dataSource.manager);
  }
}
