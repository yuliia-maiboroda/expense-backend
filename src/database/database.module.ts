import { Module } from '@nestjs/common';
import { Pool } from 'postgres-pool';
import { POSTGRES_CONFIG } from 'src/config/database/postgres';
import { PG_CONNECTION } from 'src/common/constants';

const pool = new Pool(POSTGRES_CONFIG);

pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: pool,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
