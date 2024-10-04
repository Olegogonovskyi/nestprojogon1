import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CarEntity } from '../../../database/entities/car.entity';
import { CarBrandListRequeryDto } from '../../car-brand-module/dto/carBrandListRequeryDto';

@Injectable()
export class CarBrandRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }
  public async findAll(
    query: CarBrandListRequeryDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('carBrand');
    if (query.search) {
      qb.andWhere('CONCAT(carBrand.name, carBrand.model) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }
    qb.take(query.limit);
    qb.skip(query.offset);
    return await qb.getManyAndCount();
  }
}
