import { PostsEntity } from '../../../database/entities/post.entity';
import { CreateUpdateResDto } from '../dto/res/createUpdateRes.dto';
import { PostListRequeryDto } from '../dto/req/PostListReqQuery.dto';
import { PostListResDto } from '../dto/res/PostListRes.dto';
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
      image,
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
      image,
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
    paidInfo?: PaidInfoInterface,
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
