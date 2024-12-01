import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

import { EntityEnum } from '../enums/entity.enum';
import { UsersEntity } from './users.entity';

@Entity(EntityEnum.REFRESH_TOKEN)
export class RefreshTokenEntity extends IdCreateUpdateEntity {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column('text')
  userID: string;
  @ManyToOne(() => UsersEntity, (entity) => entity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userID' })
  user?: UsersEntity;
}
