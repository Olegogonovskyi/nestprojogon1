import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostsEntity } from '../../../database/entities/post.entity';
import { PostListRequeryDto } from '../../posts/dto/req/PostListReqQueryDto';

@Injectable()
export class PostRepository extends Repository<PostsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostsEntity, dataSource.manager);
  }

  public async getById(postId: string): Promise<PostsEntity> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.tags', 'tag');
    qb.andWhere('post.id = :postId', { postId });

    return await qb.getOneOrFail();
  }

  public async getList(
    query: PostListRequeryDto,
  ): Promise<[PostsEntity[], number]> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.tags', 'tag');
    if (query.search) {
      qb.andWhere('CONCAT(post.title, post.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }
}
