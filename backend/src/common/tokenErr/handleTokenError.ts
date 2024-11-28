import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export function handleTokenError(error: any): never {
  if (
    error instanceof TokenExpiredError ||
    error instanceof JsonWebTokenError
  ) {
    throw new UnauthorizedException('Invalid or expired token');
  } else {
    throw new InternalServerErrorException(
      'Error generating verification token',
    );
  }
}
