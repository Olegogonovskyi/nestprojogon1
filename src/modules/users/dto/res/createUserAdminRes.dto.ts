import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../../../auth/dto/req/baseUserReq.dto';

export class CreateUserAdminResDto extends PickType(BaseUserReqDto, [
  'id',
  'name',
  'email',
  'age',
  'role',
  'position',
]) {}
