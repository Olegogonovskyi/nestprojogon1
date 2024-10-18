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

@Module({
  imports: [RedisModule, PostsModule, FileStorageModule],
  controllers: [UsersController, UsersAdminController],
  providers: [
    UsersService,
    DeleteCreateTokens,
    AuthCacheService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
