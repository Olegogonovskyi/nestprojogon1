import { CreateResCarBrandModuleDto } from '../dto/res/createRes-car-brand-module.dto';
import { CarBrandListRequeryDto } from '../dto/carBrandListRequeryDto';
import { CarBrandListResDto } from '../dto/res/carBrandListResDto';

export class CarBrandMapper {
  public static toResListDto(
    entites: CreateResCarBrandModuleDto[],
    total: number,
    query: CarBrandListRequeryDto,
  ): CarBrandListResDto {
    return {
      data: entites,
      total,
      ...query,
    };
  }
}
