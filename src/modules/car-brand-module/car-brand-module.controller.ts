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
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ControllerEnum } from '../enums/controllerEnum';
import { RoleEnum } from '../../database/enums/role.enum';
import { CreateResCarBrandModuleDto } from './dto/res/createRes-car-brand-module.dto';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { CarBrandListRequeryDto } from './dto/carBrandListRequeryDto';
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
  @ApiResponse({
    status: 201,
    description: 'The carBrand has been successfully created.',
    type: CreateResCarBrandModuleDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBody({ type: CreateReqCarBrandModuleDto })
  @Post()
  public async create(
    @Body() createCarBrandModuleDto: CreateReqCarBrandModuleDto,
    @CurrentUser() userData: ReqAfterGuard,
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
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiResponse({
    status: 201,
    description: 'The carBrand has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request.',
    type: CreateResCarBrandModuleDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBody({ type: UpdateCarBrandModuleDto })
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
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.carBrandModuleService.remove(id);
  }
}
