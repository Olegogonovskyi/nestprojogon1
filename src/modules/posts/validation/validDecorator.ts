import { registerDecorator, ValidationOptions } from 'class-validator';
import { NotContainsWordsConstraint } from './validEx';

// Декоратор для застосування валідатора
export function NotContainsWords(
  words: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: words, // передаємо список заборонених слів
      validator: NotContainsWordsConstraint,
    });
  };
}
