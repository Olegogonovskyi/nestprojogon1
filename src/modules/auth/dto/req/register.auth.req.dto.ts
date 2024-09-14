import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from './baseUserReq.dto';

export class RegisterAuthReqDto extends PickType(BaseUserReqDto, [
  'name',
  'email',
  'password',
  'age',
  'age',
  'image',
  'deviceId',
]) {}
