import { Entity, Column } from 'typeorm';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

import { EntityEnum } from '../enums/entity.enum';
import { PriseEnum } from '../enums/prise.enum';

@Entity(EntityEnum.POSTS)
export class PostsEntity extends IdCreateUpdateEntity {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  body: string;

  @Column('text', { nullable: true })
  image: string;

  @Column({ type: 'enum', enum: PriseEnum, default: PriseEnum.UAN })
  prise: PriseEnum;

  @Column('boolean', { default: false })
  isActive: boolean;
}
