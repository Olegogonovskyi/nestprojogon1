import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  UploadedFile,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserModuleMaper } from './mapers/userModuleMaper';
import { ReqAfterGuardDto } from '../auth/dto/req/reqAfterGuard.dto';
import { CurrentUser } from '../auth/decorators/currentUserDecorator';
import { UpdateMeDto } from './dto/req/updateMe.dto';
import { ControllerEnum } from '../enums/controllerEnum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from './decorators/apiFile.decorator';

@ApiTags(ControllerEnum.USERS)
@ApiBearerAuth()
@Controller(ControllerEnum.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: `Find me`,
  })
  @Get('me')
  public async findMe(
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<UserModuleMaper> {
    const result = await this.usersService.findMe(userData.id);
    return UserModuleMaper.toResUser(result);
  }

  @ApiOperation({
    summary: `Update me`,
  })
  @Patch('me')
  public async updateMe(
    @Body() updateUserDto: UpdateMeDto,
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<UserModuleMaper> {
    const result = await this.usersService.updateMe(updateUserDto, userData.id);
    return UserModuleMaper.toResUser(result);
  }

  @ApiOperation({
    summary: `Upload avatar`,
    description: 'returns link with avatar',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiFile('avatar', false, false)
  @ApiConsumes('multipart/form-data')
  @Post('me/uploadAvatar')
  public async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<string> {
    return await this.usersService.uploadAvatar(userData, avatar);
  }

  @ApiOperation({
    summary: `Remove me`,
  })
  @Delete('me')
  public async deleteMe(
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<void> {
    await this.usersService.deleteUser(userData.id);
  }
}
