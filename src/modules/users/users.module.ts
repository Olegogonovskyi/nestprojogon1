import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthCacheService } from '../auth/services/auth.catch.service';
import { DeleteCreateTokens } from '../../helpers/delete.create.tokens';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [UsersController],
  providers: [UsersService, DeleteCreateTokens, AuthCacheService],
})
export class UsersModule {}
