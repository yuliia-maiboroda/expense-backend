import { config } from 'dotenv';

config({ path: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env` });

export const POSTGRES_CONFIG = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  ssl: process.env.NODE_ENV === 'production' && {
    rejectUnauthorized: false,
  },
};
