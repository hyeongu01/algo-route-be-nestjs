import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  url: process.env.DATABASE_URL!,
  caPath: process.env.DB_CA_PATH!,
}));
