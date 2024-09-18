import {
  Controller,
  Post,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  Patch,
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

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
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
  @Delete('admin/:userId')
  public async deleteUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.usersService.deleteUser(userId);
  }

  @ApiOperation({
    summary: `Update user *only for ${RoleEnum.ADMIN} & ${RoleEnum.MANAGER}*`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNoContentResponse({ description: 'User has been updated' })
  @Patch('admin/:userId')
  public async updateUserbyAdmin(
    @Body() updateUserDto: CreateUserByAdminDto,
  ): Promise<CreateUserAdminRes> {
    const result = await this.usersService.updateUserbyAdmin(updateUserDto);
    return UserModuleMaper.toResUserByAdmin(result);
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
