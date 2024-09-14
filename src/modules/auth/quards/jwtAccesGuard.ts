import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRepository } from '../../repository/services/users.repository';
import { UserMapper } from '../mapers/userMapper';
import { TokenTypeEnam } from '../enums/tokenTypeEnam';
import { AuthCacheService } from '../services/auth.catch.service';
import { TokenService } from '../services/tokenService';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>('SKIP_AUTH', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Invalid Authorization header format');
    }
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new Error('jstAccesGuard 34');
    }
    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenTypeEnam.ACCESS,
    );
    if (!payload) {
      throw new Error('jstAccesGuard 41');
    }

    const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );
    if (!isAccessTokenExist) {
      throw new Error('jstAccesGuard 50');
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });
    if (!user) {
      throw new Error('jstAccesGuard 57');
    }
    request.user = UserMapper.toReqUserData(user, payload);
    return true;
  }
}
