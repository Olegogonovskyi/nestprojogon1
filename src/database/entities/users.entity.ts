import { Column, Entity, OneToMany } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { RoleEnum } from '../enums/role.enum';
import { PostsEntity } from './post.entity';
import { RefreshTokenEntity } from './refreshToken.entity';

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

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
