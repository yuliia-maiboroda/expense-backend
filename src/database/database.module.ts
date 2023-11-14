import { Global, Module } from '@nestjs/common';
import { Pool } from 'postgres-pool';
import { POSTGRES_CONFIG } from 'src/config/database/postgres';
import { PG_CONNECTION } from 'src/common/constants';
import { DatabaseService } from './database.service';

const pool = new Pool(POSTGRES_CONFIG);

pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: PG_CONNECTION,
      useFactory: () => pool,
    },
  ],
  exports: [DatabaseService],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseModule {}
