import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import configuration from './config/configuration';
import { PostgresModule } from './modules/postgres/postgresModule';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { PostsModule } from './modules/posts/posts.module';
import { FileStorageModule } from './modules/filestorage/filestorageModule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PostgresModule,
    RedisModule,
    RepositoryModule,
    PostsModule,
    FileStorageModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
