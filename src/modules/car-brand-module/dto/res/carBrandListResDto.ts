import { CarBrandListRequeryDto } from '../carBrandListRequery.dto';
import { CreateResCarBrandModuleDto } from './createRes-car-brand-module.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class CarBrandListResDto extends CarBrandListRequeryDto {
  @ApiProperty({
    description: 'List of car brand modules',
    type: [CreateResCarBrandModuleDto],
  })
  @IsArray()
  data: CreateResCarBrandModuleDto[];

  @ApiProperty({
    description: 'Total number of car brand modules',
    example: 100,
  })
  @IsInt()
  @Min(0)
  total: number;
}
