import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailEnum } from './enums/emailEnam';
import { emailConstant } from './costants/emailCostants';
import { EmailTypeToPayloadType } from './types/emailTypes/email-type-to-payload.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail<T extends EmailEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayloadType[T],
  ): Promise<void> {
    try {
      const { subject, template } = emailConstant[type];
      await this.mailerService.sendMail({
        to,
        subject,
        template, // ім'я шаблону Handlebars без розширення
        context, // змінні для шаблону
      });
    } catch (e) {
      console.log(e);
      throw new NotFoundException('Error sending email');
    }
  }
}
