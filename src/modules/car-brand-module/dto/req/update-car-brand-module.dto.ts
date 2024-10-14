import { PartialType, PickType } from '@nestjs/swagger';
import { BaseCarBrandDto } from '../base-carBrand.dto';
import { IsOptional } from 'class-validator';

export class UpdateCarBrandModuleDto extends PartialType(
  PickType(BaseCarBrandDto, ['model']),
) {
  @IsOptional()
  model?: string[];
}
