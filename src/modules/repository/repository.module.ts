import { Module } from '@nestjs/common';
import { UserRepository } from './services/users.repository';
import { PostRepository } from './services/post.repository';
import { RefreshTokenRepository } from './services/refreshToken.repository';
import { ExchangeRateRepository } from './services/exchangeRate.repository';

const repositories = [
  UserRepository,
  PostRepository,
  RefreshTokenRepository,
  ExchangeRateRepository,
];

@Module({
  controllers: repositories,
  providers: repositories,
})
export class RepositoryModule {}
