import { PartialType, PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../../../auth/dto/req/baseUserReq.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleEnum } from '../../../../database/enums/role.enum';

export class CreateUserByAdminDto extends PartialType(
  PickType(BaseUserReqDto, ['name', 'email', 'age', 'role', 'position']),
) {
  @IsOptional()
  name?: string;

  @IsOptional()
  position?: string;

  @IsOptional()
  age?: number;

  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}
