import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from '../req/baseReqPostDto';

export class CreateUpdateResDto extends PickType(BaseReqPostDto, [
  'id',
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'isActive',
  'tags',
]) {}
