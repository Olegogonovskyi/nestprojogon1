import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export function AgeValidDecorators() {
  return applyDecorators(
    // заміна цього @Transform(({ value }) => value.trim()) метод helper - public static trim({ value }: { value: string }): string {}
    Type(() => Number),
    IsInt(),
    IsNumber(),
    Max(120),
    Min(13),
  );
}
