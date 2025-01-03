import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../helpers/transformHelper';
import { NameValidDecorators } from '../../decorators/nameValid.decorators';
import { AgeValidDecorators } from '../../decorators/ageValid.decorators';
import { RoleEnum } from '../../../../database/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserReqDto {
  @IsOptional()
  @IsString()
  id?: string;

  @NameValidDecorators()
  public readonly name: string;

  @Transform(TransformHelper.trim)
  @IsString()
  @IsEmail()
  public readonly email: string;

  @Transform(TransformHelper.trim)
  @IsNotIn(['password', 'qwe', 'asd', 'zxc', '123'])
  @IsString()
  @ValidateIf((obj) => obj.name != 'Oleg') // валідує тільки тоді, коли поле не дорівнює 'Oleg'
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Incorrect password',
  })
  //(?=.*[A-Za-z]) - Має містити принаймні одну літеру (великі або малі літери)
  //(?=.*\d) - Має містити принаймні одну цифру.
  //[A-Za-z\d]{8,} - Має містити від 8 символів і більше, де допустимі символи - літери (великі та малі) і цифри.
  // Цей вираз перевіряє, що пароль має довжину мінімум 8 символів і містить хоча б одну літеру та одну цифру.
  public readonly password: string;

  @IsOptional()
  @AgeValidDecorators()
  public readonly age?: number;

  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @IsOptional()
  position?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
