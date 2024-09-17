import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransformHelper } from '../../../../helpers/transformHelper';
import { PriseEnum } from '../../../../database/enums/prise.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegisterAuthResDto } from '../../../auth/dto/res/register.auth.res.dto';

export class BaseReqPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: String, minLength: 3, maxLength: 50 })
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @ApiProperty({ type: String, maxLength: 300 })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

  @ApiProperty({ type: String, maxLength: 3000 })
  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @ApiProperty({ type: [String], maxLength: 30, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @Length(3, 30, { each: true })
  @ArrayMaxSize(5)
  @Transform(TransformHelper.trimArray)
  @Transform(TransformHelper.uniqueItems)
  @Transform(TransformHelper.toLowerCaseArray)
  tags: string[];

  @IsInt()
  @Min(1)
  @ApiProperty({ type: Number, minimum: 1 })
  priseValue: number;

  @ApiProperty({ enum: PriseEnum })
  @IsEnum(PriseEnum)
  prise: PriseEnum;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = false;

  user?: RegisterAuthResDto;
}
