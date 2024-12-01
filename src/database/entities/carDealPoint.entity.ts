import { Column, Entity } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

@Entity(EntityEnum.CARDEALPOINT)
export class CarDealPointEntity extends IdCreateUpdateEntity {
  @Column('text')
  name: string;

  @Column('text')
  town: string;
}
