import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'postgres-pool';

import { PG_CONNECTION } from '../common/constants';

import { DefaultCategory, UserCategory } from '../models/categories';
import { Transaction } from '../models/transactions';
import { User } from '../models/users';
import {
  ICreateCategory,
  ICreateTransaction,
  ICreateUser,
  IDeleteRowFromTable,
  IGetAllRowsFromTable,
  IGetRowsFromTable,
  IGetUserById,
  IGetUserByUsername,
  IGetUserTransactionById,
  ISetNewCategoryForTransaction,
  IUpdateCategory,
  IUpdateSessions,
  IUpdateTransaction,
  IUpdateUsersPassword,
} from './interfaces';

@Injectable()
export class DatabaseService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async getAllRowsFromTable({
    table,
    returningColumns = [],
  }: IGetAllRowsFromTable): Promise<unknown[]> {
    const returningClause =
      returningColumns.length > 0
        ? `RETURNING ${returningColumns.join(', ')}`
        : 'RETURNING *';
    const result = await this.pool.query(
      `SELECT * FROM ${table} ${returningClause};`
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.rows;
  }

  async deleteRowFromTable({
    table,
    label,
    value,
  }: IDeleteRowFromTable): Promise<void> {
    await this.pool.query(`DELETE FROM ${table} WHERE ${label} = $1 `, [value]);
  }

  async getRowsFromTable({
    table,
    label,
    value,
    additionalLabel,
    additionalValue,
    returningColumns = [],
  }: IGetRowsFromTable): Promise<unknown[]> {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.rows;
  }

  async findUserById({ userId }: IGetUserById): Promise<User> {
    const userInstance = await this.pool.query(
      'SELECT * FROM users WHERE id = $1;',
      [userId]
    );
    return userInstance.rows[0] as User;
  }

  async findUserByUsername({ username }: IGetUserByUsername): Promise<User> {
    const userInstance = await this.pool.query(
      'SELECT * FROM users WHERE username = $1;',
      [username]
    );
    return userInstance.rows[0] as User;
  }

  async createUser({
    data,
    returningColumns = [],
  }: ICreateUser): Promise<User> {
    const { username, displayname, password } = data;
    const returningClause =
      returningColumns.length > 0
        ? `RETURNING ${returningColumns.join(', ')}`
        : 'RETURNING *';

    const query = `INSERT INTO users (username, displayname, password, sessionid, role, refreshid) VALUES ($1, $2, $3, uuid_generate_v4(), 'user', uuid_generate_v4()) ${returningClause};`;
    const userInstance = await this.pool.query(query, [
      username,
      displayname,
      password,
    ]);

    return userInstance.rows[0] as User;
  }

  async updateUserSessionAndRefreshId({
    userId,
    returningColumns = [],
  }: IUpdateSessions): Promise<User> {
    const sessionId = 'uuid_generate_v4()';
    const refreshId = 'uuid_generate_v4()';

    const query = `UPDATE users SET sessionid = ${sessionId}, refreshid = ${refreshId} WHERE id = ${userId} ${
      returningColumns.length > 0
        ? `RETURNING ${returningColumns.join(', ')}`
        : 'RETURNING *'
    };`;

    const userInstance = await this.pool.query(query);

    return userInstance.rows[0] as User;
  }

  async setSessionIdNull(userId: number) {
    await this.pool.query(
      `UPDATE users SET sessionid = null WHERE id = ${userId};`
    );
  }

  async updateUserPassword({
    userId,
    password,
  }: IUpdateUsersPassword): Promise<{ sessionid: string; refreshid: string }> {
    const userInstance = await this.pool.query(
      'UPDATE users SET password = $1, sessionid = uuid_generate_v4(), refreshid = uuid_generate_v4() WHERE id = $2 RETURNING sessionid, refreshid;',
      [password, userId]
    );

    return userInstance.rows[0] as { sessionid: string; refreshid: string };
  }

  async getDefaultCategories(): Promise<DefaultCategory[]> {
    const categories = await this.pool.query(
      'SELECT * FROM default_categories'
    );
    return categories.rows as DefaultCategory[];
  }

  async setInitCategoriesForUser(id: number): Promise<UserCategory[]> {
    const categories = await this.pool.query(
      'INSERT INTO categories ( label, type, owner, ismutable) SELECT label, type, $1, ismutable FROM default_categories RETURNING *',
      [id]
    );
    return categories.rows as UserCategory[];
  }

  async getUsersCategories(userId: number): Promise<UserCategory[]> {
    const categories = await this.pool.query(
      'SELECT * FROM categories WHERE owner = $1',
      [userId]
    );
    return categories.rows as UserCategory[];
  }

  async createCategory({
    data,
    userId,
  }: ICreateCategory): Promise<UserCategory> {
    const { label, type } = data;

    const categoryInstance = await this.pool.query(
      'INSERT INTO categories ( label, type, owner, ismutable) VALUES ($1, $2, $3, $4) RETURNING *',
      [label, type, userId, true]
    );

    return categoryInstance.rows[0] as UserCategory;
  }

  async updateCategory({
    data,
    categoryId,
    userId,
  }: IUpdateCategory): Promise<UserCategory> {
    const { label, type } = data;

    const categoryInstance = await this.pool.query(
      'UPDATE categories SET label = $1, type = $2 WHERE id = $3 AND owner = $4 RETURNING *',
      [label, type, categoryId, userId]
    );

    return categoryInstance.rows[0] as UserCategory;
  }

  async getCategoryById(categoryId: number): Promise<UserCategory> {
    const categoryInstance = await this.pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [categoryId]
    );
    return categoryInstance.rows[0] as UserCategory;
  }

  async setNewCategoryForTransaction({
    newCategoryId,
    oldCategoryid,
  }: ISetNewCategoryForTransaction): Promise<void> {
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
    return categories.rows[0] as UserCategory;
  }

  async getUsersTransactions(userId: number): Promise<Transaction[]> {
    const transactions = await this.pool.query(
      'SELECT * FROM transactions WHERE owner = $1',
      [userId]
    );

    return transactions.rows as Transaction[];
  }

  async getUserTransactionById({
    userId,
    transactionId,
  }: IGetUserTransactionById): Promise<Transaction> {
    const transactionInstance = await this.pool.query(
      'SELECT * FROM transactions WHERE owner = $1 AND id = $2',
      [userId, transactionId]
    );
    return transactionInstance.rows[0] as Transaction;
  }

  async createTransaction({
    data,
    userId,
    categoryId,
  }: ICreateTransaction): Promise<Transaction> {
    const { amount, date, label } = data;

    const transactionInstance = await this.pool.query(
      'INSERT INTO transactions ( amount, label, category, owner, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [amount, label, categoryId, userId, date]
    );

    return transactionInstance.rows[0] as Transaction;
  }

  async updateTransaction({
    data,
    transactionId,
    userId,
  }: IUpdateTransaction): Promise<Transaction> {
    const { amount, date, label, categoryId } = data;

    const transactionInstance = await this.pool.query(
      'UPDATE transactions SET amount = $1, label = $2, category = $3, date = $4 WHERE id = $5 AND owner = $6 RETURNING *',
      [amount, label, categoryId, date, transactionId, userId]
    );

    return transactionInstance.rows[0] as Transaction;
  }
}
