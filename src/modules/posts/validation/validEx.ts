import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Валідатор для перевірки наявності поганих слів у тексті
@ValidatorConstraint({ async: false })
export class NotContainsWordsConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string, args: ValidationArguments) {
    const forbiddenWords = args.constraints; // Отримуємо список заборонених слів
    if (!text || typeof text !== 'string') return true;

    return !forbiddenWords.some((word: string) => text.includes(word));
  }

  defaultMessage(args: ValidationArguments) {
    return `The text contains forbidden words: ${args.constraints.join(', ')}`;
  }
}
