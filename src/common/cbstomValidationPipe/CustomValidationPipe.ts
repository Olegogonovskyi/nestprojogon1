import {
  ValidationPipe,
  ValidationPipeOptions,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super(options);
  }

  async transform(value: any, metadata: any) {
    const target = metadata.metatype;
    const groups = metadata.data?.groups;

    if (groups && groups.includes('custom')) {
      // Використання кастомної exceptionFactory
      return super.transform(value, metadata);
    }

    // Стандартна валідація
    const errors = await super.validate(value, {
      ...metadata,
      metatype: target,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}
