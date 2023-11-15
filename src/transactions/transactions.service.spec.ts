import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';

import { mockedTransactions, mockedTransaction } from './__mocks__';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: {
            getAll: jest.fn().mockReturnValue(mockedTransactions),
            getById: jest.fn().mockReturnValue(mockedTransaction),
            create: jest.fn().mockReturnValue(mockedTransaction),
            update: jest.fn().mockReturnValue(mockedTransaction),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  describe('get all transactions', () => {
    it('should return all user transactions', async () => {
      const result = await transactionsService.getAll({ userId: 1 });
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockedTransactions[0]);
      expect(result[0].id).toBe(mockedTransactions[0].id);
      expect(result).toEqual(mockedTransactions);
    });
  });

  describe('get transaction by id', () => {
    it('should return a transaction', async () => {
      const result = await transactionsService.getById({
        transactionId: 1,
        userId: 1,
      });
      expect(result).toBeTruthy();
      expect(result.id).toBe(mockedTransaction.id);
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('create new transaction', () => {
    it('should create a new transaction', async () => {
      const result = await transactionsService.create({
        data: mockedTransaction,
        userId: 1,
        categoryId: 1,
      });
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('update transaction', () => {
    it('should update a transaction', async () => {
      const result = await transactionsService.update({
        data: mockedTransaction,
        transactionId: 1,
        userId: 1,
      });
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('delete transaction', () => {
    it('should delete a transaction', async () => {
      const result = await transactionsService.delete({
        transactionId: 1,
        userId: 1,
      });
      expect(result).toBeUndefined();
    });
  });
});
