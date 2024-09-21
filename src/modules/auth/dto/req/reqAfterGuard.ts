import { PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from './baseUserReq.dto';

export class ReqAfterGuard extends PickType(BaseUserReqDto, [
  'id',
  'email',
  'deviceId',
  'role',
]) {}
