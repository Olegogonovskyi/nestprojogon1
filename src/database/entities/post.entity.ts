import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';

import { EntityEnum } from '../enums/entity.enum';
import { PriseEnum } from '../enums/prise.enum';
import { UsersEntity } from './users.entity';
import { TagEntity } from './tag.entity';
import { PostViewEntity } from './postViev.entity';
import { CarBrandEnum } from '../../modules/posts/enums/carEnum';

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

  @Column('decimal', { default: 1 })
  priseValue: number;

  @Column({ type: 'enum', enum: PriseEnum, default: PriseEnum.UAH })
  prise: PriseEnum;

  @Column({ type: 'enum', enum: CarBrandEnum, default: CarBrandEnum.HORSE })
  carBrand: CarBrandEnum;

  @Column('decimal', { nullable: true })
  usdPrice: number;

  @Column('decimal', { nullable: true })
  eurPrice: number;

  @Column('decimal', { nullable: true })
  uahPrice: number;

  @Column()
  exchangeRateDate: Date;

  @Column('int', { default: 0 })
  editAttempts: number;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('text')
  userID: string;
  @ManyToOne(() => UsersEntity, (entity) => entity.posts)
  @JoinColumn({ name: 'userID' })
  user?: UsersEntity;

  @ManyToMany(() => TagEntity, (entity) => entity.posts)
  @JoinTable()
  tags?: TagEntity[];

  @OneToMany(() => PostViewEntity, (entity) => entity.post)
  views?: PostViewEntity[];

  @Column('int', { default: 0 })
  countOfViews?: number;
}
