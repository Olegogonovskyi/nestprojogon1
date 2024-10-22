import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostViewEntity } from '../../../database/entities/postViev.entity';

@Injectable()
export class PostViewRepository extends Repository<PostViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostViewEntity, dataSource.manager);
  }

  public async countViewsByDay(postId: string): Promise<number> {
    console.log('countViewsByDay0');
    const result = await this.createQueryBuilder('post_view')
      .select('COUNT(*)', 'count')
      .where('post_view.postID = :postId', { postId })
      .andWhere('post_view.createdAt >= :startDate', {
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      })
      .getRawOne();
    console.log('countViewsByDay');
    return parseInt(result.count, 10);
  }

  public async countViewsByWeek(postId: string): Promise<number> {
    const result = await this.createQueryBuilder('post_view')
      .select('COUNT(*)', 'count')
      .where('post_view.postID = :postId', { postId })
      .andWhere('post_view.createdAt >= :startDate', {
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      })
      .getRawOne();
    return parseInt(result.count, 10);
  }

  public async countViewsByMonth(postId: string): Promise<number> {
    const result = await this.createQueryBuilder('post_view')
      .select('COUNT(*)', 'count')
      .where('post_view.postID = :postId', { postId })
      .andWhere('post_view.createdAt >= :startDate', {
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      })
      .getRawOne();
    return parseInt(result.count, 10);
  }
}
