import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'postgres-pool';
import { UpdateCategoryDto, CreateCategoryDto } from 'src/categories/dto';
import { PG_CONNECTION } from 'src/common/constants';
import { DefaultCategory, UserCategory } from 'src/models/categories';
import { User } from 'src/models/users';
import { UserRegistrationDto } from 'src/users/dto';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown) {
    return this.pool.query(query, params);
  }

  async getAllRowsFromTable(
    table: string,
    returningColumns: string[] = []
  ): Promise<any> {
    const returningClause =
      returningColumns.length > 0
        ? `RETURNING ${returningColumns.join(', ')}`
        : 'RETURNING *';
    const result = await this.pool.query(
      `SELECT * FROM ${table} ${returningClause};`
    );
    return result.rows;
  }

  async deleteRowFromTable(
    table: string,
    label: string,
    value: number
  ): Promise<void> {
    await this.pool.query(`DELETE FROM ${table} WHERE ${label} = $1 `, [value]);
  }

  async getRowsFromTable(
    table: string,
    label: string,
    value: number | string,
    additionalLabel?: string,
    additionalValue?: number | string,
    returningColumns: string[] = []
  ): Promise<any> {
    const selectedColumns =
      returningColumns.length > 0 ? returningColumns.join(', ') : ' *';

    const result = await this.pool.query(
      `SELECT ${selectedColumns} FROM ${table} WHERE ${label} = $1 ${
        additionalLabel
          ? 'AND ' + additionalLabel + ' = ' + additionalValue
          : ''
      };`,
      [value]
    );
    return result.rows;
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

  async getDefaultCategories(): Promise<DefaultCategory[]> {
    const categories = await this.pool.query(
      'SELECT * FROM default_categories'
    );
    return categories.rows;
  }

  async setInitCategoriesForUser(id: number): Promise<UserCategory[]> {
    const categories = await this.pool.query(
      'INSERT INTO categories ( label, type, owner, ismutable) SELECT label, type, $1, ismutable FROM default_categories RETURNING *',
      [id]
    );
    return categories.rows;
  }

  async getUsersCategories(userId: number): Promise<UserCategory[]> {
    const categories = await this.pool.query(
      'SELECT * FROM categories WHERE owner = $1',
      [userId]
    );
    return categories.rows;
  }

  async createCategory(
    data: CreateCategoryDto,
    userId: number
  ): Promise<UserCategory> {
    const { label, type } = data;

    const categoryInstance = await this.pool.query(
      'INSERT INTO categories ( label, type, owner, ismutable) VALUES ($1, $2, $3, $4) RETURNING *',
      [label, type, userId, true]
    );

    return categoryInstance.rows[0];
  }

  async updateCategory(
    data: UpdateCategoryDto,
    categoryId: number,
    userId: number
  ): Promise<UserCategory> {
    const { label, type } = data;

    const categoryInstance = await this.pool.query(
      'UPDATE categories SET label = $1, type = $2 WHERE id = $3 AND owner = $4 RETURNING *',
      [label, type, categoryId, userId]
    );

    return categoryInstance.rows[0];
  }

  async getCategoryById(categoryId: number): Promise<UserCategory> {
    const categoryInstance = await this.pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [categoryId]
    );
    return categoryInstance.rows[0];
  }

  async setNewCategoryForTransaction(
    newCategoryId: number,
    oldCategoryid: number
  ): Promise<void> {
    await this.pool.query(
      'UPDATE transactions SET category = $1 WHERE category = $2',
      [newCategoryId, oldCategoryid]
    );
  }

  async getDefaultUserCategory(userId: number): Promise<UserCategory> {
    const categories = await this.pool.query(
      'SELECT * FROM categories WHERE owner = $1 AND ismutable = false AND label = $2',
      [userId, 'Others']
    );
    return categories.rows[0];
  }
}
