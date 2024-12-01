import { PickType } from '@nestjs/swagger';
import { BaseCarBrandDto } from '../base-carBrand.dto';

export class CreateReqCarBrandModuleDto extends PickType(BaseCarBrandDto, [
  'name',
  'model',
]) {}
