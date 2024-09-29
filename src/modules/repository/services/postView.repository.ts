import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostViewEntity } from '../../../database/entities/postViev.entity';

@Injectable()
export class PostViewRepository extends Repository<PostViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostViewEntity, dataSource.manager);
  }
}