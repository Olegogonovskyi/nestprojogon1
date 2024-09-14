import { RefreshTokenRepository } from '../modules/repository/services/refreshToken.repository';
import { AuthCacheService } from '../modules/auth/services/auth.catch.service';
import { TokenPair } from '../modules/auth/models/tokenPair';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCreateTokens {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
  ) {}
  public async deleteTokens(deviceId: string, id: string): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.delete({
        deviceId: deviceId,
        userID: id,
      }),
      this.authCacheService.deleteToken(id, deviceId),
    ]);
  }
  public async saveNewTokens(
    deviceId: string,
    id: string,
    tokens: TokenPair,
  ): Promise<void> {
    await Promise.all([
      this.refreshTokenRepository.save({
        deviceId: deviceId,
        refreshToken: tokens.refreshToken,
        userID: id,
      }),
      this.authCacheService.saveToken(tokens.accessToken, id, deviceId),
    ]);
  }
}
