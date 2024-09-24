import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateResDto';
import { PostListRequeryDto } from '../dto/req/PostListReqQueryDto';
import { PostListResDto } from '../dto/res/PostListResDto';
import { UserMapper } from '../../auth/mapers/userMapper';

export class PostMapper {
  private static toResDto(
    post: PostsEntity,
    views?: number,
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
    };
    return views !== undefined ? { ...baseDto, countOfViews: views } : baseDto;
  }

  public static toResUpdateDto(post: PostsEntity): CreateUpdateResDto {
    return this.toResDto(post);
  }

  public static toResCreateDto(
    post: PostsEntity,
    views: number,
  ): CreateUpdateResDto {
    return this.toResDto(post, views);
  }

  public static toResListDto(
    entites: PostsEntity[],
    total: number,
    query: PostListRequeryDto,
  ): PostListResDto {
    return {
      data: entites.map(this.toResCreateDto),
      total,
      ...query,
    };
  }
}

//PostListResDto
