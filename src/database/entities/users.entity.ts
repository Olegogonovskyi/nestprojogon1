import { Column, Entity } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { RoleEnum } from '../enums/role.enum';

@Entity(EntityEnum.USERS)
export class UsersEntity extends IdCreateUpdateEntity {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('int')
  age: number;

  @Column('text') //посада
  position: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.BUYER })
  role: RoleEnum;

  @Column('text', { nullable: true })
  image: string;
}
