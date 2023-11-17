import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesRepository } from './categories.repository';
import { mockedCategories } from './__mocks__';

describe('CategoriesRepository', () => {
  let categoriesRepository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoriesRepository,
          useValue: {
            getAll: jest.fn().mockReturnValue(mockedCategories),
            getById: jest.fn().mockReturnValue(mockedCategories[0]),
            create: jest.fn().mockReturnValue(mockedCategories[0]),
            update: jest.fn().mockReturnValue(mockedCategories[0]),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(categoriesRepository).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all categories', async () => {
      const result = await categoriesRepository.getAll({ userId: 1 });
      expect(result).toEqual(mockedCategories);
    });
  });

  describe('getById', () => {
    it('should get category by id', async () => {
      const result = await categoriesRepository.getById({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toEqual(mockedCategories[0]);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const result = await categoriesRepository.create({
        data: mockedCategories[0],
        userId: 1,
      });
      expect(result).toEqual(mockedCategories[0]);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const result = await categoriesRepository.update({
        data: mockedCategories[0],
        categoryId: 1,
        userId: 1,
      });
      expect(result).toEqual(mockedCategories[0]);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = await categoriesRepository.delete({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toBeUndefined();
    });
  });
});
