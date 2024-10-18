import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CarBrandModuleService } from './car-brand-module.service';
import { CreateReqCarBrandModuleDto } from './dto/req/createReq-car-brand-module.dto';
import { UpdateCarBrandModuleDto } from './dto/req/update-car-brand-module.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ControllerEnum } from '../enums/controllerEnum';
import { RoleEnum } from '../../database/enums/role.enum';
import { CreateResCarBrandModuleDto } from './dto/res/createRes-car-brand-module.dto';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { ReqAfterGuardDto } from '../auth/dto/req/reqAfterGuard.dto';
import { CarBrandListRequeryDto } from './dto/carBrandListRequery.dto';
import { CarBrandMapper } from './services/carBrandMapper';
import { CarBrandListResDto } from './dto/res/carBrandListResDto';
import { RolesGuard } from '../users/guards/RolesGuard';
import { Roles } from '../users/decorators/roleDecorator';

@ApiTags(ControllerEnum.CARBRAND)
@Controller(ControllerEnum.CARBRAND)
export class CarBrandModuleController {
  constructor(private readonly carBrandModuleService: CarBrandModuleService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Create a new carBrand with models *only for ${RoleEnum.ADMIN} & ${RoleEnum.MANAGER}*`,
  })
  @Post()
  public async create(
    @Body() createCarBrandModuleDto: CreateReqCarBrandModuleDto,
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<CreateResCarBrandModuleDto> {
    return await this.carBrandModuleService.create(
      createCarBrandModuleDto,
      userData,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `List of car brands for frontend `,
  })
  @Get()
  public async findAll(
    @Query() query: CarBrandListRequeryDto,
  ): Promise<CarBrandListResDto> {
    const [entites, number] = await this.carBrandModuleService.findAll(query);
    return CarBrandMapper.toResListDto(entites, number, query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Update a new carBrand with models *only for ${RoleEnum.ADMIN} & ${RoleEnum.MANAGER}*`,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarBrandModuleDto: UpdateCarBrandModuleDto,
  ): Promise<CreateResCarBrandModuleDto> {
    return this.carBrandModuleService.update(id, updateCarBrandModuleDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Delete carBrand by id`,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.carBrandModuleService.remove(id);
  }
}
