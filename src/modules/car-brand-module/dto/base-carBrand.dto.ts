import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NameValidDecorators } from '../../auth/decorators/nameValid.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCarBrandDto {
  constructor() {
    this.model = [];
  }

  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @NameValidDecorators()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  model: string[];
}
