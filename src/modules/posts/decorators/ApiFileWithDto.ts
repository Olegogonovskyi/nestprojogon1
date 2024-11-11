import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

export const ApiFileWithDto = <TModel extends Type<any>>(
  fileName: string,
  dto: TModel,
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(dto),
    ApiBody({
      schema: {
        allOf: [
          { $ref: getSchemaPath(dto) },
          {
            type: 'object',
            required: isRequired ? [fileName] : [],
            properties: {
              [fileName]: isArray
                ? {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary',
                    },
                  }
                : {
                    type: 'string',
                    format: 'binary',
                  },
              tags: {
                // Додано правильне відображення поля tags
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        ],
      },
    }),
  );
};
