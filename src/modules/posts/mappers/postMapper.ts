import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateResDto';
import { PostListRequeryDto } from '../dto/req/PostListReqQueryDto';
import { PostListResDto } from '../dto/res/PostListResDto';
import { UserMapper } from '../../auth/mapers/userMapper';
import { PaidInfoInterface } from '../types/paidInfo.interface';

export class PostMapper {
  private static toResDto(
    post: PostsEntity,
    paidInfo: PaidInfoInterface,
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
      town,
      region,
      model,
      year,
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
      town,
      region,
      model,
      year,
    };
    return paidInfo !== undefined
      ? { ...baseDto, paidInfo: paidInfo }
      : baseDto;
  }

  public static toResUpdateDto(post: PostsEntity): CreateUpdateResDto {
    return this.toResDto(post, undefined);
  }

  public static toResCreateDto(
    post: PostsEntity,
    paidInfo: PaidInfoInterface,
  ): CreateUpdateResDto {
    return this.toResDto(post, paidInfo);
  }

  public static toResListDto(
    entites: PostsEntity[],
    total: number,
    query: PostListRequeryDto,
  ): PostListResDto {
    return {
      data: entites.map((entity) => this.toResCreateDto(entity, undefined)),
      total,
      ...query,
    };
  }
}
