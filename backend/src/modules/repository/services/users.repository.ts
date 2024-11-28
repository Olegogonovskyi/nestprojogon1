import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from '../../../database/entities/users.entity';

@Injectable()
export class UserRepository extends Repository<UsersEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UsersEntity, dataSource.manager);
  }
}
