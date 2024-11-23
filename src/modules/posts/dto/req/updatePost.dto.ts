import { PickType } from '@nestjs/swagger';
import { BaseReqPostDto } from './baseReqPost.dto';
import { IsOptional } from 'class-validator';
import { PriseEnum } from '../../../../database/enums/prise.enum';

export class UpdatePostDto extends PickType(BaseReqPostDto, [
  'title',
  'description',
  'body',
  'priseValue',
  'prise',
  'image',
  'carBrand',
  'region',
  'town',
  'model',
  'year',
]) {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  body: string;

  @IsOptional()
  region: string;

  @IsOptional()
  town: string;

  @IsOptional()
  model: string;

  @IsOptional()
  priseValue: number;

  @IsOptional()
  prise: PriseEnum;

  @IsOptional()
  image: string[];

  @IsOptional()
  carBrand: string;

  @IsOptional()
  year: number;
}
