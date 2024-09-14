import { Entity, Column } from 'typeorm';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

import { EntityEnum } from '../enums/entity.enum';

@Entity(EntityEnum.REFRESH_TOKEN)
export class RefreshTokenEntity extends IdCreateUpdateEntity {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;
}
