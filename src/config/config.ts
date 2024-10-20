import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = z
  .object({
    // biome-ignore lint/style/useNamingConvention: <explanation>
    NODE_ENV: z.enum(['production', 'development', 'test']),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    PORT: z.coerce.number().default(3000).optional(),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_SECRET: z.string().nonempty().describe('JWT secret key'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(30).describe('minutes after which access tokens expire'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30).describe('days after which refresh tokens expire'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce
      .number()
      .default(10)
      .describe('minutes after which reset password token expires'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce
      .number()
      .default(10)
      .describe('minutes after which verify email token expires'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_HOST: z.string().optional().describe('server that will send the emails'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_PORT: z.coerce.number().optional().describe('port to connect to the email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_USERNAME: z.string().optional().describe('username for email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    SMTP_PASSWORD: z.string().optional().describe('password for email server'),
    // biome-ignore lint/style/useNamingConvention: <explanation>
    EMAIL_FROM: z.string().optional().describe('the from field in the emails sent by the app'),
  })
  .strict()
  .passthrough(); // Allow additional keys

const result = envVarsSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Config validation error: ${result.error.issues.map((issue) => issue.message).join(', ')}`);
}

const envVars = result.data;

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
