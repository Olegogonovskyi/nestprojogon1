import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReqCarBrandModuleDto } from './dto/req/createReq-car-brand-module.dto';
import { UpdateCarBrandModuleDto } from './dto/req/update-car-brand-module.dto';
import { ReqAfterGuardDto } from '../auth/dto/req/reqAfterGuard.dto';
import { CreateResCarBrandModuleDto } from './dto/res/createRes-car-brand-module.dto';
import { CarBrandRepository } from '../repository/services/carBrand.repository';
import { CarBrandListRequeryDto } from './dto/carBrandListRequery.dto';
import { CarEntity } from '../../database/entities/car.entity';

@Injectable()
export class CarBrandModuleService {
  constructor(private readonly carBrandRepository: CarBrandRepository) {}

  public async create(
    createCarBrandModuleDto: CreateReqCarBrandModuleDto,
    userData: ReqAfterGuardDto,
  ): Promise<CreateResCarBrandModuleDto> {
    const carBrand = await this.carBrandRepository.save(
      this.carBrandRepository.create({
        ...createCarBrandModuleDto,
        userID: userData.id,
      }),
    );

    return carBrand;
  }

  public async findAll(
    query: CarBrandListRequeryDto,
  ): Promise<[CarEntity[], number]> {
    return await this.carBrandRepository.findAll(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} carBrandModule`;
  }

  public async update(
    id: string,
    updateCarBrandModuleDto: UpdateCarBrandModuleDto,
  ): Promise<CreateResCarBrandModuleDto> {
    const carBrand = await this.carBrandRepository.findOneBy({ id: id });
    if (!carBrand) {
      throw new NotFoundException(`There are no carBrand with this id: ${id}`);
    }
    carBrand.model = [...carBrand.model, ...updateCarBrandModuleDto.model];

    return this.carBrandRepository.save(carBrand);
  }

  public async remove(id: string): Promise<void> {
    await this.carBrandRepository.delete({ id: id });
  }
}
