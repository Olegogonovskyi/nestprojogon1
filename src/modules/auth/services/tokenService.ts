import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt';

import { Config, JwtConfig } from '../../../config/config.types';
import { JwtPayload } from '../models/jwtPayload';
import { TokenPair } from '../models/tokenPair';
import { TokenTypeEnum } from '../enums/tokenTypeEnum';
import { handleTokenError } from '../../../common/tokenErr/handleTokenError';

@Injectable()
export class TokenService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }

  public async generateAuthTokens(payload: JwtPayload): Promise<TokenPair> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.accessSecret,
        expiresIn: this.jwtConfig.accessExpiresIn,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.refreshSecret,
        expiresIn: this.jwtConfig.refreshExpiresIn,
      });

      return { accessToken, refreshToken };
    } catch (e) {
      handleTokenError(e);
    }
  }

  public async genreVerifToken(payload: JwtPayload): Promise<string> {
    try {
      console.log(this.jwtConfig.verifSecret);
      console.log(this.jwtConfig.verifTime);
      return await this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.verifSecret,
        expiresIn: this.jwtConfig.verifTime,
      });
    } catch (e) {
      handleTokenError(e);
    }
  }

  public async verifyToken(
    token: string,
    type: TokenTypeEnum,
  ): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getSecret(type),
      });
    } catch (e) {
      handleTokenError(e);
    }
  }

  private getSecret(type: TokenTypeEnum): string {
    try {
      let secret: string;
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = this.jwtConfig.accessSecret;
          break;
        case TokenTypeEnum.REFRESH:
          secret = this.jwtConfig.refreshSecret;
          break;
        case TokenTypeEnum.VERIFY:
          secret = this.jwtConfig.verifSecret;
          break;
        default:
          throw new UnauthorizedException('Unknown token type');
      }
      return secret;
    } catch (e) {
      handleTokenError(e);
    }
  }
}
