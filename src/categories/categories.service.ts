import { Injectable } from '@nestjs/common';

import { CategoriesRepository } from './categories.repository';
import { UserCategory } from '../models/categories';
import {
  ICreateCategory,
  IUpdateCategory,
  IUserAndCategoryIds,
} from './interfaces';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async getAll({ userId }: { userId: number }): Promise<UserCategory[]> {
    return await this.categoriesRepository.getAll({ userId });
  }

  async create({ data, userId }: ICreateCategory): Promise<UserCategory> {
    return await this.categoriesRepository.create({ data, userId });
  }

  async update({
    data,
    categoryId,
    userId,
  }: IUpdateCategory): Promise<UserCategory> {
    return await this.categoriesRepository.update({ data, categoryId, userId });
  }

  async delete({ categoryId, userId }: IUserAndCategoryIds): Promise<void> {
    await this.categoriesRepository.delete({ categoryId, userId });
  }

  async getById({
    categoryId,
    userId,
  }: IUserAndCategoryIds): Promise<UserCategory> {
    return await this.categoriesRepository.getById({ categoryId, userId });
  }
}
