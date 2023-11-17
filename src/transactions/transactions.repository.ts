import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { Transaction } from '../models/transactions';
import { TYPE_OF_CATEGORY } from '../models/categories';
import {
  ICreateTransaction,
  IUpdateTransaction,
  IUserAndTransactionsIds,
} from './interfaces';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll({ userId }: { userId: number }): Promise<Transaction[]> {
    return await this.databaseService.getUsersTransactions(userId);
  }

  async getById({
    transactionId,
    userId,
  }: IUserAndTransactionsIds): Promise<Transaction> {
    return this.getTransactionInstance(transactionId, userId);
  }

  async create({
    data,
    userId,
    categoryId,
  }: ICreateTransaction): Promise<Transaction> {
    const date = data.date ? new Date(data.date) : new Date();

    const { amount } = await this.validateTransactionAmount(
      categoryId,
      userId,
      data.amount
    );

    await this.checkForDuplicateTransaction(
      data.label,
      amount,
      date,
      userId,
      categoryId
    );

    return await this.databaseService.createTransaction({
      data: { ...data, date, amount },
      userId,
      categoryId,
    });
  }

  async update({
    data,
    transactionId,
    userId,
  }: IUpdateTransaction): Promise<Transaction> {
    const transactionInstance: Transaction = await this.getTransactionInstance(
      transactionId,
      userId
    );

    const {
      amount = transactionInstance.amount,
      label = transactionInstance.label,
      date = transactionInstance.date,
      categoryId = transactionInstance.category,
    } = data;

    const { amount: newAmount } = await this.validateTransactionAmount(
      categoryId,
      userId,
      amount
    );

    await this.checkForDuplicateTransaction(
      label,
      newAmount,
      date,
      userId,
      categoryId
    );

    return await this.databaseService.updateTransaction({
      data: { amount: newAmount, label, date, categoryId },
      transactionId,
      userId,
    });
  }

  async delete({
    transactionId,
    userId,
  }: IUserAndTransactionsIds): Promise<void> {
    await this.getTransactionInstance(transactionId, userId);

    await this.databaseService.deleteRowFromTable({
      table: 'transactions',
      label: 'id',
      value: transactionId,
    });
  }

  private async checkForDuplicateTransaction(
    label: string,
    amount: number,
    date: Date,
    userId: number,
    categoryId: number
  ): Promise<void> {
    const existingTransaction =
      await this.databaseService.getUsersTransactions(userId);

    const repeatedTransaction = existingTransaction.find(
      transaction =>
        transaction.label === label &&
        transaction.amount === amount &&
        transaction.category === categoryId &&
        transaction.date === date
    );

    if (repeatedTransaction) throw new ConflictException();
  }

  private async validateTransactionAmount(
    categoryId: number,
    userId: number,
    amount: number
  ): Promise<{ amount: number }> {
    const categoryInstance =
      await this.databaseService.getCategoryById(categoryId);

    if (!categoryInstance) throw new NotFoundException();

    if (categoryInstance.owner !== userId) throw new ForbiddenException();

    if (isNaN(Number(amount))) throw new BadRequestException('Invalid amount');

    if (
      (categoryInstance.type === TYPE_OF_CATEGORY.income && amount < 0) ||
      (categoryInstance.type === TYPE_OF_CATEGORY.expense && amount > 0)
    )
      return { amount: -amount };

    return { amount };
  }

  private async getTransactionInstance(
    transactionId: number,
    userId: number
  ): Promise<Transaction> {
    const transactionInstance =
      await this.databaseService.getUserTransactionById({
        userId,
        transactionId,
      });

    if (!transactionInstance) throw new NotFoundException();

    if (transactionInstance.owner !== userId) throw new ForbiddenException();

    return transactionInstance;
  }
}
