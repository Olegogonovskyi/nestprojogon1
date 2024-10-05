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
    qb.leftJoinAndSelect('post.user', 'user');
    qb.andWhere('post.id = :postId', { postId });

    return await qb.getOneOrFail();
  }

  public async countPostsByUserId(userId: string): Promise<number> {
    return this.createQueryBuilder('post')
      .where('post.userID = :userId', { userId })
      .getCount();
  }

  public async getAveragePriceForCarBand(
    CarBand: string,
    model: string,
  ): Promise<number> {
    const result = await this.createQueryBuilder('post')
      .select('AVG(post.priseValue)', 'avgPrice')
      .where('post.carBrand = :carBrand', { carBrand: CarBand })
      .where('post.model = :model', { model: model })
      .getRawOne();

    return parseFloat(result.avgPrice);
  }

  public async getList(
    query: PostListRequeryDto,
  ): Promise<[PostsEntity[], number]> {
    const qb = this.createQueryBuilder('post');
    qb.leftJoinAndSelect('post.tags', 'tag');
    qb.leftJoinAndSelect('post.user', 'user');
    qb.andWhere('post.isActive = :isActive', { isActive: true });
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
