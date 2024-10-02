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
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'register user' })
  @SkipAuth()
  @Post('register')
  public async register(
    @Body() registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    return this.authService.register(registerAuthDto);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @SkipAuth()
  @Post('login')
  public async login(@Body() loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: 'Refresh Tokkens' })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @SkipAuth()
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: ReqAfterGuard,
  ): Promise<TokenPair> {
    return await this.authService.refresh(userData);
  }

  @ApiOperation({ summary: 'Logout from devices' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  public async logOut(@CurrentUser() userData: ReqAfterGuard): Promise<void> {
    await this.authService.logout(userData);
  }

  @ApiOperation({ summary: 'Verify created user' })
  @ApiNoContentResponse({ description: 'User has been verifed' })
  @ApiBearerAuth()
  @Post('verify')
  public async verifyUser(@Query('token') token: string): Promise<string> {
    return await this.authService.verifyUser(token);
  }
}
