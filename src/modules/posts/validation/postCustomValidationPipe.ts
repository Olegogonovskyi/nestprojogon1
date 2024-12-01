import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class PostCustomValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (errors) {
      if (Array.isArray(errors)) {
        return { errors };
      }
      throw new BadRequestException(errors);
    }
  }
}
