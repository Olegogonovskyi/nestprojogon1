import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from './baseReqPostDto';
import { IsOptional } from 'class-validator';
import { PriseEnum } from '../../../../database/enums/prise.enum';
import { CarBrandEnum } from '../../enums/carEnum';

export class UpdatePostDto extends PickType(BaseReqPostDto, [
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'image',
  'carBrand',
]) {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  body: string;

  @IsOptional()
  priseValue: number;

  @IsOptional()
  prise: PriseEnum;

  @IsOptional()
  image: string;

  @IsOptional()
  carBrand: CarBrandEnum;
}
