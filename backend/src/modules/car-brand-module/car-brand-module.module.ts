import { Module } from '@nestjs/common';
import { CarBrandModuleService } from './car-brand-module.service';
import { CarBrandModuleController } from './car-brand-module.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from '../auth/quards/jwtAccesGuard';
import { RolesGuard } from '../users/guards/RolesGuard';
import { TokenService } from '../auth/services/tokenService';
import { AuthCacheService } from '../auth/services/auth.catch.service';
import { DeleteCreateTokens } from '../../helpers/delete.create.tokens';
import { JwtModule } from '@nestjs/jwt';
import { PostsModule } from '../posts/posts.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PostsModule, JwtModule, RedisModule],
  controllers: [CarBrandModuleController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CarBrandModuleService,
    TokenService,
    AuthCacheService,
    DeleteCreateTokens,
  ],
})
export class CarBrandModuleModule {}
