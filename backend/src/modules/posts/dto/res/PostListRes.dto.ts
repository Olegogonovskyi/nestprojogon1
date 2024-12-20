import { CreateUpdateResDto } from './createUpdateRes.dto';
import { PostListRequeryDto } from '../req/PostListReqQuery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class PostListResDto extends PostListRequeryDto {
  @ApiProperty({
    description: 'List of posts',
    type: [CreateUpdateResDto],
  })
  @IsArray()
  data: CreateUpdateResDto[];

  @ApiProperty({
    description: 'Total number of car brand modules',
    example: 100,
  })
  @IsInt()
  @Min(0)
  total: number;
}
