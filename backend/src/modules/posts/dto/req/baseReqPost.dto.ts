import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
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

export class BaseReqPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  body: string;

  @ApiProperty({ type: [String], isArray: true })
  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image: string[];

  @ApiProperty({ type: Number, description: 'Value of the prise' })
  @IsInt()
  @Min(1)
  @ApiProperty({ type: Number, minimum: 1 })
  @Type(() => Number)
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

  @IsString()
  carBrandId: string;

  @ApiProperty({ type: Number, description: 'Year of the car' })
  @IsInt()
  @Min(1945)
  @Max(2025)
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in EUR' })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  eurPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in USD' })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  usdPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'currency in UAN' })
  @IsNumber({ allowInfinity: false, allowNaN: false })
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
