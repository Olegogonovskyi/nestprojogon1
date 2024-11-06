import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

export const ApiFileWithDto = <TModel extends Type<any>>(
  fileName: string,
  dto: TModel,
  isArray = true,
  isRequired = true,
): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(dto), // Додаємо модель, щоб Swagger її знав
    ApiBody({
      schema: {
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
          ...{
            dto: {
              $ref: getSchemaPath(dto),
            },
          },
        },
      },
    }),
  );
};
