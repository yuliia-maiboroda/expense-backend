import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'postgres-pool';
import { PG_CONNECTION } from 'src/common/constants';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown) {
    return this.pool.query(query, params);
  }
}
