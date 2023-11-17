import { Test, TestingModule } from '@nestjs/testing';

import { isGuarded } from '../test/utils';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { DatabaseModule } from '../database/database.module';

import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

import { mockedTransactions, mockedTransaction } from './__mocks__';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      imports: [AuthenticationModule, DatabaseModule],
      providers: [
        {
          provide: TransactionsService,
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
    transactionsController = moduleRef.get<TransactionsController>(
      TransactionsController
    );
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });

  it('should be protected with JwtAuthGuard', () => {
    expect(isGuarded(TransactionsController, JwtAuthGuard)).toBe(true);
  });

  describe('get all transactions', () => {
    it('should return all user transactions', async () => {
      const result = await transactionsController.getAll(1);
      expect(result).toEqual(mockedTransactions);
    });
  });

  describe('get transaction by id', () => {
    it('should return a transaction by id', async () => {
      const result = await transactionsController.getById(1, 1);
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('create new transaction', () => {
    it('should create a new transaction', async () => {
      const result = await transactionsController.create(
        1,
        1,
        mockedTransaction
      );
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('update transaction', () => {
    it('should update a transaction', async () => {
      const result = await transactionsController.update(
        1,
        1,
        mockedTransaction
      );
      expect(result).toEqual(mockedTransaction);
    });
  });

  describe('delete transaction', () => {
    it('should delete a transaction', async () => {
      const result = await transactionsController.delete(1, 1);
      expect(result).toBeUndefined();
    });
  });
});
