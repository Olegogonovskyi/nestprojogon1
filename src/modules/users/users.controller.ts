import {
  Controller,
  Post,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  Patch,
  UseGuards,
  UploadedFile,
  Get,
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
import { CreateUserByAdminDto } from './dto/req/createUserByAdminDto';
import { CreateUserAdminRes } from './dto/res/createUserAdminRes';
import { UserModuleMaper } from './mapers/userModuleMaper';
import { RoleEnum } from '../../database/enums/role.enum';
import { ReqAfterGuard } from '../auth/dto/req/reqAfterGuard';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { UpdateUserByAdminDto } from './dto/req/updateUserByAdminDto';
import { UpdateMeDto } from './dto/req/updateMeDto';
import { ControllerEnum } from '../enums/controllerEnum';
import { RolesGuard } from './guards/RolesGuard';
import { Roles } from './decorators/roleDecorator';

@ApiTags(ControllerEnum.USERS)
@ApiBearerAuth()
@Controller(ControllerEnum.USERS)
export class UsersController {
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
  @Post('admin/create')
  public async create(
    @Body() CreateUserByAdminDto: CreateUserByAdminDto,
  ): Promise<CreateUserAdminRes> {
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
  @Delete('admin/user/:id')
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
  @Patch('admin/user/:id')
  public async updateUserbyAdmin(
    @Body() updateUserDto: UpdateUserByAdminDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CreateUserAdminRes> {
    const result = await this.usersService.updateUserbyAdmin(updateUserDto, id);
    return UserModuleMaper.toResUserByAdmin(result);
  }

  @ApiOperation({
    summary: `Find me`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('me')
  public async findMe(
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<UserModuleMaper> {
    const result = await this.usersService.findMe(userData.id);
    return UserModuleMaper.toResUser(result);
  }

  @ApiOperation({
    summary: `Update me`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNoContentResponse({ description: 'User has been updated' })
  @Patch('me')
  public async updateMe(
    @Body() updateUserDto: UpdateMeDto,
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<UserModuleMaper> {
    const result = await this.usersService.updateMe(updateUserDto, userData.id);
    return UserModuleMaper.toResUser(result);
  }

  @ApiOperation({
    summary: `Upload avatar`,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNoContentResponse({ description: 'Avatar was changed' })
  @Post('me/uploadAvatar')
  public async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<void> {
    await this.usersService.uploadAvatar(userData, avatar);
  }

  @ApiOperation({
    summary: `Remove me`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNoContentResponse({ description: 'User has been removed' })
  @Delete('me')
  public async deleteMe(@CurrentUser() userData: ReqAfterGuard): Promise<void> {
    await this.usersService.deleteMe(userData);
  }
}
