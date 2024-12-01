import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from '../req/baseReqPost.dto';
import { IsOptional } from 'class-validator';
import { PaidInfoInterface } from '../../types/paidInfo.interface';
import { PaidInfoResDto } from './paidInfoRes.dto';

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
    'user',
    'countOfViews',
    'carBrand',
  ]),
) {
  @IsOptional()
  @ApiProperty({ type: PaidInfoResDto, required: false })
  paidInfo?: PaidInfoInterface | undefined;
}
