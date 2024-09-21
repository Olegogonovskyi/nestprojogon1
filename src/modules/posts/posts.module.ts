import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../users/guards/RolesGuard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [PostsService],
})
export class PostsModule {}
