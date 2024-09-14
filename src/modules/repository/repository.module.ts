import { Global, Module } from '@nestjs/common';
import { UserRepository } from './services/users.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refreshToken.repository';
import { ExchangeRateRepository } from './services/exchangeRate.repository';
import { TagRepository } from './services/tag.repository';

const repositories = [
  UserRepository,
  PostRepository,
  RefreshTokenRepository,
  ExchangeRateRepository,
  TagRepository,
];

@Global()
@Module({
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
