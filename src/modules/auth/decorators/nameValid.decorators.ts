import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../helpers/transformHelper';
import { IsNotIn, IsString, Length } from 'class-validator';

export function NameValidDecorators() {
  return applyDecorators(
    Transform(TransformHelper.trim), // трошки переробити
    IsString(),
    IsNotIn(['fuck']),
    Length(2, 20),
  );
}
