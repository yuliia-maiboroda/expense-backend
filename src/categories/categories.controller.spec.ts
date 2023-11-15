import { Test, TestingModule } from '@nestjs/testing';

import { isGuarded } from '../test/utils';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { DatabaseModule } from '../database/database.module';

import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';

import { mockedCategories, mockedCategory } from './__mocks__';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      imports: [AuthenticationModule, DatabaseModule],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            getAllUsersCategories: jest.fn().mockReturnValue(mockedCategories),
            getCategoryById: jest.fn().mockReturnValue(mockedCategory),
            createUsersCategory: jest.fn().mockReturnValue(mockedCategory),
            updateUsersCategory: jest.fn().mockReturnValue(mockedCategory),
            deleteUsersCategory: jest.fn(),
          },
        },
      ],
    }).compile();
    categoriesController =
      moduleRef.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });

  it('should be protected with JwtAuthGuard', () => {
    expect(isGuarded(CategoriesController, JwtAuthGuard)).toBe(true);
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const result = await categoriesController.create(1, {
        label: 'test',
        type: 'income',
      });
      expect(result).toEqual(mockedCategory);
    });
  });

  describe('getAll', () => {
    it('should return all user categories', async () => {
      const result = await categoriesController.getAll(1);

      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockedCategories[0]);
      expect(result[0].id).toBe(mockedCategories[0].id);
      expect(result).toEqual(mockedCategories);
    });
  });

  describe('get by id', () => {
    it('should return a category', async () => {
      const result = await categoriesController.getById(1, 1);

      expect(result).toBeTruthy();
      expect(result.id).toBe(mockedCategory.id);
      expect(result).toEqual(mockedCategory);
    });
  });

  describe('delete by id', () => {
    it('should return a void', async () => {
      const result = await categoriesController.delete(1, 1);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const result = await categoriesController.update(1, 1, {
        label: 'test',
        type: 'income',
      });
      expect(result).toEqual(mockedCategory);
    });
  });
});
