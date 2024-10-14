import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from './baseUserReq.dto';

export class ReqAfterGuardDto extends PickType(BaseUserReqDto, [
  'id',
  'email',
  'deviceId',
  'role',
  'isVerified',
]) {}
