import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateResDto';
import { PostListRequeryDto } from '../dto/req/PostListReqQueryDto';
import { PostListResDto } from '../dto/res/PostListResDto';
import { UserMapper } from '../../auth/mapers/userMapper';

export class PostMapper {
  private static toResDto(
    post: PostsEntity,
    views?: number,
    averagePrise?: number,
  ): CreateUpdateResDto {
    const {
      id,
      title,
      description,
      body,
      uahPrice,
      eurPrice,
      usdPrice,
      isActive,
      tags,
      user,
      carBrand,
    } = post;
    const baseDto = {
      id,
      title,
      description,
      body,
      uahPrice,
      eurPrice,
      usdPrice,
      isActive,
      tags: tags ? tags.map((tag) => tag.name) : [],
      user: UserMapper.toResponseDTO(user),
      carBrand,
    };
    return views !== undefined
      ? { ...baseDto, countOfViews: views, averagePrise }
      : baseDto;
  }

  public static toResUpdateDto(post: PostsEntity): CreateUpdateResDto {
    return this.toResDto(post);
  }

  public static toResCreateDto(
    post: PostsEntity,
    views?: number,
    averagePrise?: number,
  ): CreateUpdateResDto {
    return this.toResDto(post, views, averagePrise);
  }

  public static toResListDto(
    entites: PostsEntity[],
    total: number,
    query: PostListRequeryDto,
  ): PostListResDto {
    return {
      data: entites.map((entity) => this.toResCreateDto(entity)),
      total,
      ...query,
    };
  }
}
