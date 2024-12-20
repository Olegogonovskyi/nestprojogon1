import { Column, Entity, OneToMany } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { RoleEnum } from '../enums/role.enum';
import { PostsEntity } from './post.entity';
import { RefreshTokenEntity } from './refreshToken.entity';
import { CarEntity } from './car.entity';
import { Exclude } from 'class-transformer';

@Entity(EntityEnum.USERS)
export class UsersEntity extends IdCreateUpdateEntity {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Exclude()
  @Column('text')
  password: string;

  @Column('int')
  age: number;

  @Column('text', { nullable: true }) //посада
  position: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.SELLER })
  role: RoleEnum;

  @Column('text', { nullable: true })
  image: string;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('text', { nullable: true })
  verifyToken: string;

  @OneToMany(() => PostsEntity, (entity) => entity.user)
  posts?: PostsEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  carBrandModels?: CarEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
