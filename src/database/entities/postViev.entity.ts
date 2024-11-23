import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PostsEntity } from './post.entity';
import { IdCreateUpdateEntity } from './models/IdCreateUpdateEntity';
import { EntityEnum } from '../enums/entity.enum';

@Entity(EntityEnum.POSTVIEWS)
export class PostViewEntity extends IdCreateUpdateEntity {
  @Column('text')
  postID: string;
  @ManyToOne(() => PostsEntity, (entity) => entity.views, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postID' })
  post: PostsEntity;
}
