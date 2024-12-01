import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../../../auth/dto/req/baseUserReq.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleEnum } from '../../../../database/enums/role.enum';

export class CreateUserByAdminDto extends PickType(BaseUserReqDto, [
  'name',
  'email',
  'password',
  'age',
  'role',
  'position',
]) {
  @IsOptional()
  position?: string;

  @IsOptional()
  age?: number;

  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}
