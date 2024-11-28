import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterAuthReqDto } from './dto/req/register.auth.req.dto';
import { UserRepository } from '../repository/services/users.repository';
import { TokenService } from './services/tokenService';
import { DeleteCreateTokens } from 'src/helpers/delete.create.tokens';
import { UserMapper } from './mapers/userMapper';
import { AuthResDto } from './dto/res/auth.res.dto';
import { LoginReqDto } from './dto/req/loginReq.dto';
import { TokenPair } from './models/tokenPair';
import { ReqAfterGuardDto } from './dto/req/reqAfterGuard.dto';
import { EmailService } from '../emailodule/emailodule.service';
import { EmailEnum } from '../emailodule/enums/emailEnam';
import { TokenTypeEnum } from './enums/tokenTypeEnum';
import * as process from 'node:process';
import { handleTokenError } from '../../common/tokenErr/handleTokenError';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly deleteCreateTokens: DeleteCreateTokens,
    private readonly emailService: EmailService,
  ) {}

  public async register(
    registerAuthDto: RegisterAuthReqDto,
  ): Promise<AuthResDto> {
    const password = bcrypt.hashSync(registerAuthDto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...registerAuthDto, password }),
    );

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: registerAuthDto.deviceId,
    });

    const verToken = await this.tokenService.genreVerifToken({
      userId: user.id,
    });

    try {
      await Promise.all([
        this.userRepository.update(user.id, { verifyToken: verToken }),
        this.deleteCreateTokens.saveNewTokens(
          registerAuthDto.deviceId,
          user.id,
          tokens,
        ),
        this.emailService.sendEmail(EmailEnum.WELCOME, user.email, {
          layout: 'main',
          name: user.name,
          frontUrl: process.env.FRONTEND_URL,
          actionToken: verToken,
        }),
      ]);
    } catch (e) {
      throw new InternalServerErrorException('Registration failed');
    }

    return { user: UserMapper.toResponseDTO(user), tokens: tokens };
  }

  public async login(loginAuthDto: LoginReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPaswordValid = bcrypt.compareSync(
      loginAuthDto.password,
      user.password,
    );
    if (!isPaswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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

  public async refresh(userData: ReqAfterGuardDto): Promise<TokenPair> {
    await this.deleteCreateTokens.deleteTokens(userData.deviceId, userData.id);
    const tokens = await this.tokenService.generateAuthTokens({
      userId: userData.id,
      deviceId: userData.deviceId,
    });
    await this.deleteCreateTokens.saveNewTokens(
      userData.deviceId,
      userData.id,
      tokens,
    );
    return tokens;
  }

  public async verifyUser(verToken: string): Promise<string> {
    try {
      const payload = await this.tokenService.verifyToken(
        verToken,
        TokenTypeEnum.VERIFY,
      );
      const userToVer = await this.userRepository.findOneBy({
        id: payload.userId,
      });
      if (!userToVer) {
        throw new NotFoundException('User not found');
      }
      userToVer.isVerified = true;
      await this.userRepository.update(userToVer.id, { isVerified: true });
      return 'User successfully verified';
    } catch (e) {
      handleTokenError(e);
    }
  }

  public async logout(userData: ReqAfterGuardDto): Promise<void> {
    await this.deleteCreateTokens.deleteTokens(userData.deviceId, userData.id);
  }
}
