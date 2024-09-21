import { Entity, Column } from 'typeorm';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

import { EntityEnum } from '../enums/entity.enum';
import { PriseEnum } from '../enums/prise.enum';

@Entity(EntityEnum.EXCHANGERATE)
export class ExchangeRateEntity extends IdCreateUpdateEntity {
  @Column({ type: 'enum', enum: PriseEnum, default: PriseEnum.UAN })
  currency: PriseEnum;

  @Column('int')
  rate: number;

  @Column('date')
  date: Date;
}
