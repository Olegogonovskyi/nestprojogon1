import { PickType } from '@nestjs/swagger';
import { BaseCarBrandDto } from '../base-carBrand.dto';

export class CreateResCarBrandModuleDto extends PickType(BaseCarBrandDto, [
  'name',
  'model',
]) {}
