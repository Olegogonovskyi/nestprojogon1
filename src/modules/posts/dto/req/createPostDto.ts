import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from './baseReqPostDto';

export class CreatePostDto extends PickType(BaseReqPostDto, [
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'image',
  'tags',
]) {}
