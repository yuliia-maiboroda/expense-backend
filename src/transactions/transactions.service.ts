import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from 'src/models/transactions';
import {
  ICreateTransaction,
  IUpdateTransaction,
  IUserAndTransactionsIds,
} from './interfaces';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async getAll({ userId }: { userId: number }): Promise<Transaction[]> {
    return await this.transactionsRepository.getAll({ userId });
  }

  async getById({
    transactionId,
    userId,
  }: IUserAndTransactionsIds): Promise<Transaction> {
    return await this.transactionsRepository.getById({ transactionId, userId });
  }

  async create({
    data,
    userId,
    categoryId,
  }: ICreateTransaction): Promise<Transaction> {
    return await this.transactionsRepository.create({
      data,
      userId,
      categoryId,
    });
  }

  async update({
    data,
    transactionId,
    userId,
  }: IUpdateTransaction): Promise<Transaction> {
    return await this.transactionsRepository.update({
      data,
      transactionId,
      userId,
    });
  }

  async delete({
    transactionId,
    userId,
  }: IUserAndTransactionsIds): Promise<void> {
    await this.transactionsRepository.delete({ transactionId, userId });
  }
}
