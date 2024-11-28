import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthCacheService } from '../auth/services/auth.catch.service';
import { DeleteCreateTokens } from '../../helpers/delete.create.tokens';
import { RedisModule } from '../redis/redis.module';
import { RolesGuard } from './guards/RolesGuard';
import { PostsModule } from '../posts/posts.module';
import { APP_GUARD } from '@nestjs/core';
import { FileStorageModule } from '../filestorage/filestorageModule';
import { UsersAdminController } from './usersAdmin.controller';
import { EmailModule } from '../emailodule/emailodule.module';
import { TokenService } from '../auth/services/tokenService';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RedisModule,
    PostsModule,
    FileStorageModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [
    UsersService,
    DeleteCreateTokens,
    AuthCacheService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    TokenService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
