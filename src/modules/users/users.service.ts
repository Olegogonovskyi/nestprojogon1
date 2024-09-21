import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserByAdminDto } from './dto/req/createUserByAdminDto';
import { UsersEntity } from '../../database/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repository/services/users.repository';
import { AuthCacheService } from '../auth/services/auth.catch.service';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { UpdateUserByAdminDto } from './dto/req/updateUserByAdminDto';
import { UpdateMeDto } from './dto/req/updateMeDto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
  ) {}

  public async create(
    CreateUserByAdminDto: CreateUserByAdminDto,
  ): Promise<UsersEntity> {
    const password = await bcrypt.hash(CreateUserByAdminDto.password, 10);
    console.log(`password:  ${password}`);
    const isExistUser = await this.userRepository.findOneBy({
      email: CreateUserByAdminDto.email,
    });
    console.log(`isExistUser:  ${isExistUser}`);
    if (isExistUser) {
      throw new ConflictException(
        `this email exist in base with id ${isExistUser.id}`,
      );
    }

    return await this.userRepository.save(
      this.userRepository.create({ ...CreateUserByAdminDto, password }),
    );
  }

  public async updateUserbyAdmin(
    updateUserDto: UpdateUserByAdminDto,
    userId: string,
  ): Promise<UsersEntity> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async updateMe(
    updateUserDto: UpdateMeDto,
    userId: string,
  ): Promise<UsersEntity> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async deleteUser(userId: string): Promise<void> {
    await Promise.all([
      this.userRepository.delete({ id: userId }),
      this.authCacheService.deleteByIdKey(userId),
    ]);
  }

  public async deleteMe(userData: ReqAfterGuard): Promise<void> {
    await Promise.all([
      this.userRepository.delete({ id: userData.id }),
      this.authCacheService.deleteByIdKey(userData.id),
    ]);
  }
}
