import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthCacheService } from '../auth/services/auth.catch.service';
import { DeleteCreateTokens } from '../../helpers/delete.create.tokens';
import { RedisModule } from '../redis/redis.module';
import { RolesGuard } from './guards/RolesGuard';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [RedisModule, PostsModule],
  controllers: [UsersController],
  providers: [UsersService, DeleteCreateTokens, AuthCacheService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
