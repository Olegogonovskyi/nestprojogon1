import { Global, Module } from '@nestjs/common';
import { UserRepository } from './services/users.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refreshToken.repository';
import { TagRepository } from './services/tag.repository';
import { PostViewRepository } from './services/postView.repository';
import { CarBrandRepository } from './services/carBrand.repository';

const repositories = [
  UserRepository,
  PostRepository,
  RefreshTokenRepository,
  TagRepository,
  PostViewRepository,
  CarBrandRepository,
];

@Global()
@Module({
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
