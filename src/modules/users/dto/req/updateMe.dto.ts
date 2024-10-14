import { PartialType, PickType } from '@nestjs/swagger';
import { BaseUserReqDto } from '../../../auth/dto/req/baseUserReq.dto';
import { IsOptional } from 'class-validator';

export class UpdateMeDto extends PartialType(
  PickType(BaseUserReqDto, ['name', 'age']),
) {
  @IsOptional()
  name?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  image?: string;
}
