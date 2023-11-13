import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from 'src/transactions/dto';

export interface IGetUserTransactionById {
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
