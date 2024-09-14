import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostsEntity } from '../../../database/entities/post.entity';

@Injectable()
export class PostRepository extends Repository<PostsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostsEntity, dataSource.manager);
  }
}
