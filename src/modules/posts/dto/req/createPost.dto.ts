import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from './baseReqPost.dto';
import { IsOptional } from 'class-validator';

export class CreatePostDto extends PickType(BaseReqPostDto, [
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'tags',
  'carBrand',
  'region',
  'town',
  'year',
  'model',
]) {
  @IsOptional()
  tags?: string[];
}
