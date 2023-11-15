import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';

import { mockedCategories, mockedCategory } from './__mocks__';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            getAll: jest.fn().mockReturnValue(mockedCategories),
            getById: jest.fn().mockReturnValue(mockedCategory),
            create: jest.fn().mockReturnValue(mockedCategory),
            update: jest.fn().mockReturnValue(mockedCategory),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const result = await categoriesService.createUsersCategory({
        data: mockedCategory,
        userId: 1,
      });
      expect(result).toEqual(mockedCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const result = await categoriesService.updateUsersCategory({
        data: mockedCategory,
        categoryId: 1,
        userId: 1,
      });
      expect(result).toEqual(mockedCategory);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = await categoriesService.deleteUsersCategory({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all user categories', async () => {
      const result = await categoriesService.getAllUsersCategories({
        userId: 1,
      });
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(mockedCategories[0]);
      expect(result[0].id).toBe(mockedCategories[0].id);
      expect(result).toEqual(mockedCategories);
    });
  });

  describe('get by id', () => {
    it('should return a category', async () => {
      const result = await categoriesService.getCategoryById({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toBeTruthy();
      expect(result.id).toBe(mockedCategory.id);
      expect(result).toEqual(mockedCategory);
    });
  });
});
