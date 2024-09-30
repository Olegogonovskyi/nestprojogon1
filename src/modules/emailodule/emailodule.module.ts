import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './emailodule.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('SMTP_EMAIL'),
            pass: configService.get('SMTP_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: configService.get('SMTP_EMAIL'),
        },
        template: {
          dir: join(
            process.cwd(),
            'src',
            'modules',
            'emailodule',
            'templates',
            'views',
          ),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
          partials: {
            dir: join(
              process.cwd(),
              'src',
              'modules',
              'emailodule',
              'templates',
              'partials',
            ),
            options: {
              strict: true,
            },
          },
          layouts: {
            dir: join(
              process.cwd(),
              'src',
              'modules',
              'emailodule',
              'templates',
              'layouts',
            ),
            options: {
              strict: true,
            },
          },
          viewPath: join(
            process.cwd(),
            'src',
            'modules',
            'emailodule',
            'templates',
            'views',
          ),
        },
      }),
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailoduleModule {}
