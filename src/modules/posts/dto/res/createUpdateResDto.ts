import { PartialType, PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from '../req/baseReqPostDto';

export class CreateUpdateResDto extends PartialType(
  PickType(BaseReqPostDto, [
    'id',
    'title',
    'description',
    'body',
    'priseValue',
    'prise',
    'usdPrice',
    'uahPrice',
    'eurPrice',
    'isActive',
    'tags',
    'user',
  ]),
) {}
