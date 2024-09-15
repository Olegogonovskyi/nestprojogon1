import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateResDto';

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
      tags: tags.map((tag) => tag.name),
    };
  }
}
