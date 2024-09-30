import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthCacheService } from './services/auth.catch.service';
import { TokenService } from './services/tokenService';
import { DeleteCreateTokens } from '../../helpers/delete.create.tokens';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './quards/jwtAccesGuard';
import { RedisModule } from '../redis/redis.module';
import { EmailoduleModule } from '../emailodule/emailodule.module';

@Module({
  imports: [JwtModule, UsersModule, RedisModule, EmailoduleModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    TokenService,
    AuthCacheService,
    DeleteCreateTokens,
  ],
})
export class AuthModule {}
