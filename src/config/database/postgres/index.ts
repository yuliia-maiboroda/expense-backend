import { config } from 'dotenv';

config();

export const POSTGRES_CONFIG = {
  host: process.env['POSTGRES_HOST'] as string,
  database: process.env['POSTGRES_DB'] as string,
  user: process.env['POSTGRES_USER'] as string,
  password: process.env['POSTGRES_PASSWORD'] as string,
  port: Number(process.env['POSTGRES_PORT']) as number,
  ssl: {
    rejectUnauthorized: false,
  },
};
