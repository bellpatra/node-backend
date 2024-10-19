import path from 'node:path';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object()
  .keys({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    PORT: Joi.number().default(3000),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_USERNAME: Joi.string().description('username for email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
