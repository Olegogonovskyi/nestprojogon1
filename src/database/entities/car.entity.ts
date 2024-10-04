import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { PostsEntity } from './post.entity';
import { UsersEntity } from './users.entity';

@Entity(EntityEnum.CARBRAND)
export class CarEntity extends IdCreateUpdateEntity {
  @Column('text', { unique: true })
  name: string;

  @Column('simple-array')
  model: string[];

  @OneToMany(() => PostsEntity, (entity) => entity.carBrand)
  posts?: PostsEntity[];

  @Column('text')
  userID: string;
  @ManyToOne(() => UsersEntity, (entity) => entity.carBrandModels)
  @JoinColumn({ name: 'userID' })
  user?: UsersEntity;
}
