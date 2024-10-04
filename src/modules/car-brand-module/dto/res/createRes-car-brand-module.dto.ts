import { PickType } from '@nestjs/swagger';
import { BaseCarBrandDto } from '../base-carBrandDto';

export class CreateResCarBrandModuleDto extends PickType(BaseCarBrandDto, [
  'name',
  'model',
]) {}
