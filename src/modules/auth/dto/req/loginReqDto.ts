import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from './baseUserReq.dto';

export class LoginReqDto extends PickType(BaseUserReqDto, [
  'email',
  'password',
  'deviceId',
]) {}
