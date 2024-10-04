import { PickType } from '@nestjs/swagger';
import { BaseCarBrandDto } from '../base-carBrandDto';

export class CreateReqCarBrandModuleDto extends PickType(BaseCarBrandDto, [
  'name',
  'model',
]) {}
