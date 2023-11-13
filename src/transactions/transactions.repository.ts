import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { Transaction } from 'src/models/transactions';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TYPE_OF_CATEGORY } from 'src/models/categories';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(userId: number): Promise<Transaction[]> {
    return await this.databaseService.getUsersTransactions(userId);
  }

  async getById(transactionId: number, userId: number) {
    return this.getTransactionInstance(transactionId, userId);
  }

  async create(
    transactionData: CreateTransactionDto,
    userId: number,
    categoryId: number
  ): Promise<Transaction> {
    const date = transactionData.date
      ? new Date(transactionData.date)
      : new Date();

    const { amount } = await this.validateTransactionAmount(
      categoryId,
      userId,
      transactionData.amount
    );

    await this.checkForDuplicateTransaction(
      transactionData.label,
      amount,
      date,
      userId,
      categoryId
    );

    return await this.databaseService.createTransaction({
      data: { ...transactionData, date, amount },
      userId,
      categoryId,
    });
  }

  async update(
    transactionData: UpdateTransactionDto,
    transactionId: number,
    userId: number
  ): Promise<Transaction> {
    const transactionInstance: Transaction = await this.getTransactionInstance(
      transactionId,
      userId
    );

    const {
      amount = transactionInstance.amount,
      label = transactionInstance.label,
      date = transactionInstance.date,
      categoryId = transactionInstance.category,
    } = transactionData;

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

  async delete(transactionId: number, userId: number): Promise<void> {
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
