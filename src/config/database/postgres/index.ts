import { config } from 'dotenv';

config();

export const POSTGRES_CONFIG = {
  host: process.env['POSTGRES_HOST'] ?? 'localhost',
  database: process.env['POSTGRES_DB'] ?? 'postgres',
  user: process.env['POSTGRES_USER'] ?? 'postgres',
  password: process.env['POSTGRES_PASSWORD'] ?? 'postgres',
  port: Number(process.env['POSTGRES_PORT']) ?? 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};
