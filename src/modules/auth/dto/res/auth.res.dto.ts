import { TokenPair } from '../../models/tokenPair';
import { RegisterAuthResDto } from './register.auth.res.dto';

export class AuthResDto {
  user: RegisterAuthResDto;
  tokens: TokenPair;
}
