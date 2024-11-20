import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TransformHelper } from '../../../../helpers/transformHelper';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PostListRequeryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @ApiProperty()
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;
}
