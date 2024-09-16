import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateResDto';
import { PostListRequeryDto } from '../dto/req/PostListReqQueryDto';
import { PostListResDto } from '../dto/res/PostListResDto';

export class PostMapper {
  public static toResCreateDto(post: PostsEntity): CreateUpdateResDto {
    const { id, title, description, body, priseValue, prise, isActive, tags } =
      post;
    return {
      id,
      title,
      description,
      body,
      priseValue,
      prise,
      isActive,
      tags: tags ? tags.map((tag) => tag.name) : [],
    };
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
