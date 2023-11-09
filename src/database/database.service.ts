import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'postgres-pool';
import { PG_CONNECTION } from 'src/common/constants';
import { User } from 'src/models/users';
import { UserRegistrationDto } from 'src/users/dto';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown) {
    return this.pool.query(query, params);
  }

  async findUserById(userId: number): Promise<User> {
    const userInstance = await this.pool.query(
      'SELECT * FROM users WHERE id = $1;',
      [userId]
    );
    return userInstance.rows[0];
  }

  async findUserByUsername(username: string): Promise<User> {
    const userInstance = await this.pool.query(
      'SELECT * FROM users WHERE username = $1;',
      [username]
    );
    return userInstance.rows[0];
  }

  async createUser(
    data: UserRegistrationDto,
    returningColumns: string[] = []
  ): Promise<User> {
    try {
      const { username, displayname, password } = data;
      const sessionId = 'uuid_generate_v4()';
      const returningClause =
        returningColumns.length > 0
          ? `RETURNING ${returningColumns.join(', ')}`
          : 'RETURNING *';

      const query = `INSERT INTO users (username, displayname, password, sessionId, role) VALUES ($1, $2, $3, ${sessionId}, 'user') ${returningClause};`;
      const userInstance = await this.pool.query(query, [
        username,
        displayname,
        password,
      ]);

      return userInstance.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async updateUserSessionId(
    userId: number,
    returningColumns: string[] = []
  ): Promise<User> {
    const sessionId = 'uuid_generate_v4()';

    const query = `UPDATE users SET sessionId = ${sessionId} WHERE id = ${userId} ${
      returningColumns.length > 0
        ? `RETURNING ${returningColumns.join(', ')}`
        : 'RETURNING *'
    }    ;`;

    const userInstance = await this.pool.query(query);

    return userInstance.rows[0];
  }
}
