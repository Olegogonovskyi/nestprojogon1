import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TransformHelper } from '../../../../helpers/transformHelper';
import { Transform, Type } from 'class-transformer';

export class PostListRequeryDto {
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @IsString()
  @IsOptional()
  tag?: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;
}
