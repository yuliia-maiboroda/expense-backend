import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';

import { mockedCategories, mockedCategory } from './__mocks__';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

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
      const result = await categoriesService.create({
        data: mockedCategory,
        userId: 1,
      });
      expect(result).toEqual(mockedCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const result = await categoriesService.update({
        data: mockedCategory,
        categoryId: 1,
        userId: 1,
      });
      expect(result).toEqual(mockedCategory);
    });

    it('should throw forbidden error', async () => {
      jest
        .spyOn(categoriesService, 'update')
        .mockRejectedValueOnce(new ForbiddenException());

      await expect(
        categoriesService.update({
          data: mockedCategory,
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw not found error', async () => {
      jest
        .spyOn(categoriesService, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        categoriesService.update({
          data: mockedCategory,
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const result = await categoriesService.delete({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toBeUndefined();
    });

    it('should throw forbidden error', async () => {
      jest
        .spyOn(categoriesService, 'delete')
        .mockRejectedValueOnce(new ForbiddenException());

      await expect(
        categoriesService.delete({
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw not found error', async () => {
      jest
        .spyOn(categoriesService, 'delete')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        categoriesService.delete({
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return all user categories', async () => {
      const result = await categoriesService.getAll({
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
      const result = await categoriesService.getById({
        categoryId: 1,
        userId: 1,
      });
      expect(result).toBeTruthy();
      expect(result.id).toBe(mockedCategory.id);
      expect(result).toEqual(mockedCategory);
    });

    it('should throw forbidden error', async () => {
      jest
        .spyOn(categoriesService, 'getById')
        .mockRejectedValueOnce(new ForbiddenException());

      await expect(
        categoriesService.getById({
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw not found error', async () => {
      jest
        .spyOn(categoriesService, 'getById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        categoriesService.getById({
          categoryId: 1,
          userId: 1,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
