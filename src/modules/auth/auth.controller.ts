import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { SkipAuth } from './decorators/skipAuthDecorator';
import { RegisterAuthReqDto } from './dto/req/register.auth.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from './dto/req/loginReqDto';
import { JwtAccessGuard } from './quards/jwtAccesGuard';
import { TokenPair } from './models/tokenPair';
import { CurrentUser } from './decorators/currentUserDecorator';
import { ReqAfterGuard } from './dto/req/reqAfterGuard';
import { ControllerEnum } from '../enums/controllerEnum';

@ApiTags(ControllerEnum.AUTH)
@Controller(ControllerEnum.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  public async register(
    @Body() registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    return this.authService.register(registerAuthDto);
  }
  @SkipAuth()
  @Post('login')
  public async login(@Body() loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(loginAuthDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<TokenPair> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  public async logOut(@CurrentUser() userData: ReqAfterGuard): Promise<void> {
    await this.authService.logout(userData);
  }
}
