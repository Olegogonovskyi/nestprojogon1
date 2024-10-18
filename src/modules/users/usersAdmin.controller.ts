import {
  Controller,
  Post,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserByAdminDto } from './dto/req/createUserByAdmin.dto';
import { CreateUserAdminResDto } from './dto/res/createUserAdminRes.dto';
import { UserModuleMaper } from './mapers/userModuleMaper';
import { RoleEnum } from '../../database/enums/role.enum';
import { UpdateUserByAdminDto } from './dto/req/updateUserByAdmin.dto';
import { ControllerEnum } from '../enums/controllerEnum';
import { RolesGuard } from './guards/RolesGuard';
import { Roles } from './decorators/roleDecorator';

@ApiTags(ControllerEnum.ADMINUSERS)
@ApiBearerAuth()
@Controller(ControllerEnum.ADMINUSERS)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: `Create user with role *only for ${RoleEnum.ADMIN}*`,
  })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBody({ type: CreateUserByAdminDto })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Post('create')
  public async create(
    @Body() CreateUserByAdminDto: CreateUserByAdminDto,
  ): Promise<CreateUserAdminResDto> {
    const result = await this.usersService.create(CreateUserByAdminDto);
    return UserModuleMaper.toResUserByAdmin(result);
  }

  @ApiOperation({
    summary: `Remove user *only for ${RoleEnum.ADMIN} & ${RoleEnum.MANAGER}*`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNoContentResponse({ description: 'User has been removed' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @ApiOperation({
    summary: `Update user *only for ${RoleEnum.ADMIN} & ${RoleEnum.MANAGER}*`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNoContentResponse({ description: 'User has been updated' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Patch(':id')
  public async updateUserbyAdmin(
    @Body() updateUserDto: UpdateUserByAdminDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateUserAdminResDto> {
    const result = await this.usersService.updateUserbyAdmin(updateUserDto, id);
    return UserModuleMaper.toResUserByAdmin(result);
  }
}
