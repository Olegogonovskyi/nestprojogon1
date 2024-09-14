import { Column, Entity, ManyToMany, VirtualColumn } from 'typeorm';
import { EntityEnum } from '../enums/entity.enum';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { PostsEntity } from './post.entity';

@Entity(EntityEnum.TAG)
export class TagEntity extends IdCreateUpdateEntity {
  @Column('text', { unique: true })
  name: string;

  @VirtualColumn({ query: () => 'NULL' })
  articleCount?: number;

  @ManyToMany(() => PostsEntity, (entity) => entity.tags)
  posts?: PostsEntity[];
}
