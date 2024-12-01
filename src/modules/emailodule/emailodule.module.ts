import * as HandlebarsLayouts from 'handlebars-layouts';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './emailodule.service';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        Handlebars.registerHelper(HandlebarsLayouts(Handlebars));
        Handlebars.registerPartial(
          'header',
          fs.readFileSync(
            join(
              process.cwd(),
              'src',
              'modules',
              'emailodule',
              'templates',
              'partials',
              'header.hbs',
            ),
            'utf8',
          ),
        );
        Handlebars.registerPartial(
          'footer',
          fs.readFileSync(
            join(
              process.cwd(),
              'src',
              'modules',
              'emailodule',
              'templates',
              'partials',
              'footer.hbs',
            ),
            'utf8',
          ),
        );

        return {
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
          },
        };
      },
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
