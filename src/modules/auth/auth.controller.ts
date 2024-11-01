import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { SkipAuth } from './decorators/skipAuthDecorator';
import { RegisterAuthReqDto } from './dto/req/register.auth.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from './dto/req/loginReq.dto';
import { TokenPair } from './models/tokenPair';
import { CurrentUser } from './decorators/currentUserDecorator';
import { ReqAfterGuardDto } from './dto/req/reqAfterGuard.dto';
import { ControllerEnum } from '../enums/controllerEnum';
import { JwtRefreshGuard } from './quards/jwtRefrGuard';

@ApiTags(ControllerEnum.AUTH)
@Controller(ControllerEnum.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'register user' })
  @SkipAuth()
  @Post('register')
  public async register(
    @Body() registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    return this.authService.register(registerAuthDto);
  }

  @ApiOperation({ summary: 'Login' })
  @SkipAuth()
  @Post('login')
  public async login(@Body() loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: 'Refresh Tokens' })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<TokenPair> {
    return await this.authService.refresh(userData);
  }

  @ApiOperation({ summary: 'Logout from devices' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  public async logOut(
    @CurrentUser() userData: ReqAfterGuardDto,
  ): Promise<void> {
    await this.authService.logout(userData);
  }

  @ApiOperation({ summary: 'Verify created user' })
  @ApiBearerAuth()
  @Post('verify')
  public async verifyUser(@Query('token') token: string): Promise<string> {
    return await this.authService.verifyUser(token);
  }
}
