import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransformHelper } from '../../../../helpers/transformHelper';
import { PriseEnum } from '../../../../database/enums/prise.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegisterAuthResDto } from '../../../auth/dto/res/register.auth.res.dto';
import { ValidationCostants } from '../../../../validationConstants/validation costants';

export class BaseReqPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: String, minLength: 3, maxLength: 50 })
  @IsString()
  @IsNotIn(ValidationCostants)
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @ApiProperty({ type: String, maxLength: 300 })
  @IsString()
  @IsNotIn(ValidationCostants)
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

  @ApiProperty({ type: String, maxLength: 3000 })
  @IsString()
  @IsNotIn(ValidationCostants)
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
  @IsNotIn(ValidationCostants)
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

  @IsString()
  carBrand: string;

  @IsString()
  model: string;

  @IsString()
  town: string;

  @IsString()
  region: string;

  @IsInt()
  @Min(1945)
  @Max(2025)
  year: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in EUR' })
  @IsNumber()
  @IsOptional()
  eurPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in USD' })
  @IsNumber()
  @IsOptional()
  usdPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in UAN' })
  @IsNumber()
  @IsOptional()
  uahPrice?: number;

  @ApiPropertyOptional({ type: Date, description: 'date of exchange currency' })
  @IsOptional()
  @IsDate()
  exchangeRateDate?: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = false;

  user?: RegisterAuthResDto;

  @ApiPropertyOptional({ type: Number, description: 'count of views' })
  @IsNumber()
  @IsOptional()
  countOfViews?: number;
}
