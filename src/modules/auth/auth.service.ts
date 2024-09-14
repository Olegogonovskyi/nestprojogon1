import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterAuthReqDto } from './dto/req/register.auth.req.dto';
import { UserRepository } from '../repository/services/users.repository';
import { TokenService } from './services/tokenService';
import { DeleteCreateTokens } from 'src/helpers/delete.create.tokens';
import { UserMapper } from './mapers/userMapper';
import { AuthResDto } from './dto/res/auth.res.dto';
import { LoginReqDto } from './dto/req/loginReqDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly deleteCreateTokens: DeleteCreateTokens,
  ) {}

  public async register(
    registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    const password = await bcrypt.hash(registerAuthDto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...registerAuthDto, password }),
    );

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: registerAuthDto.deviceId,
    });

    await this.deleteCreateTokens.saveNewTokens(
      registerAuthDto.deviceId,
      user.id,
      tokens,
    );
    return { user: UserMapper.toResponseDTO(user), tokens: tokens };
  }

  public async login(loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new Error('auth.service 53');
    }

    const isPaswordValid = bcrypt.compare(loginAuthDto.password, user.password);
    if (!isPaswordValid) {
      throw new Error('auth.service 58');
    }

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: loginAuthDto.deviceId,
    });

    await Promise.all([
      this.deleteCreateTokens.deleteTokens(loginAuthDto.deviceId, user.id),
      this.deleteCreateTokens.saveNewTokens(
        loginAuthDto.deviceId,
        user.id,
        tokens,
      ),
    ]);
    return { user: UserMapper.toResponseDTO(user), tokens: tokens };
  }
}
