import * as process from 'node:process';
import { Config } from './config.types';

export default (): Config => ({
  app: {
    port: Number(process.env.APP_PORT) || 3002,
    host: process.env.APP_HOST || 'localhost',
  },

  urls: {
    frontUrl: process.env.FRONTEND_URL,
  },

  postgres: {
    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN, 10) || 36000,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn:
      parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10) || 100000,
    verifSecret: process.env.JWT_ACTION_VERIFIED_SECRET,
    verifTime:
      parseInt(process.env.JWT_ACTION_VERIFIED_EXPIRES_IN, 10) || 50000,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWC_BUCKET_NAME,
    endpoint: process.env.AWS_ENDPOINT_URL,
  },
  email: {
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPass: process.env.SMTP_PASSWORD,
  },
});
