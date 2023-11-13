import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from 'src/models/transactions';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async getAll(userId: number): Promise<Transaction[]> {
    return await this.transactionsRepository.getAll(userId);
  }

  async getById(transactionId: number, userId: number) {
    return await this.transactionsRepository.getById(transactionId, userId);
  }

  async create(
    transactionData: CreateTransactionDto,
    userId: number,
    categoryId: number
  ) {
    return await this.transactionsRepository.create(
      transactionData,
      userId,
      categoryId
    );
  }

  async update(
    transactionData: UpdateTransactionDto,
    transactionId: number,
    userId: number
  ): Promise<Transaction> {
    return await this.transactionsRepository.update(
      transactionData,
      transactionId,
      userId
    );
  }

  async delete(transactionId: number, userId: number): Promise<void> {
    await this.transactionsRepository.delete(transactionId, userId);
  }
}
