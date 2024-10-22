import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostViewEntity } from '../../../database/entities/postViev.entity';
import { StatDateEnum } from '../../../common/enums/statDateEnum';

@Injectable()
export class PostViewRepository extends Repository<PostViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PostViewEntity, dataSource.manager);
  }

  public async countViews(
    postId: string,
    period: StatDateEnum,
  ): Promise<number> {
    let startDate: Date;
    switch (period) {
      case StatDateEnum.DAY:
        startDate = new Date(new Date().setHours(0, 0, 0, 0));
        break;
      case StatDateEnum.WEEK:
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        break;
      case StatDateEnum.MONTH:
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
        break;
      default:
        throw new BadRequestException('Invalid period');
    }

    const qb = this.createQueryBuilder('post_view');
    qb.where('post_view.postID = :postId', { postId });
    qb.andWhere('post_view.created >= :startDate', {
      startDate: startDate,
    });
    qb.andWhere('post_view.created < :endDate', {
      endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    });
    const count = await qb.getCount();

    return Number(count);
  }
}
