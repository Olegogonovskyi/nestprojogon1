import { CreateUpdateResDto } from './createUpdateResDto';
import { PostListRequeryDto } from '../req/PostListReqQueryDto';

export class PostListResDto extends PostListRequeryDto {
  data: CreateUpdateResDto[];
  total: number;
}
