import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { SkipAuth } from './decorators/skipAuthDecorator';
import { RegisterAuthReqDto } from './dto/req/register.auth.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from './dto/req/loginReqDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  public async register(
    @Body() registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    console.log('authcontroller20');
    return this.authService.register(registerAuthDto);
  }
  @SkipAuth()
  @Post('login')
  public async login(@Body() loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(loginAuthDto);
  }
}
