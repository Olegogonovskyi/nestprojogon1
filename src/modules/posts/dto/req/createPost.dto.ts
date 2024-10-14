import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from './baseReqPost.dto';

export class CreatePostDto extends PickType(BaseReqPostDto, [
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'image',
  'tags',
  'carBrand',
  'region',
  'town',
  'year',
  'model',
]) {}