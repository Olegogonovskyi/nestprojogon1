import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../req/baseUserReq.dto';

export class RegisterAuthResDto extends PickType(BaseUserReqDto, [
  'id',
  'name',
  'age',
  'email',
  'image',
]) {}
