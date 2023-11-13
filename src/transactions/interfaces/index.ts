import { CreateTransactionDto, UpdateTransactionDto } from '../dto';

export interface IUserAndTransactionsIds {
  userId: number;
  transactionId: number;
}

export interface ICreateTransaction {
  data: CreateTransactionDto;
  userId: number;
  categoryId: number;
}

export interface IUpdateTransaction {
  data: UpdateTransactionDto;
  transactionId: number;
  userId: number;
}
