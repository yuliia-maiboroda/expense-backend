import { Injectable } from '@nestjs/common';

import { CategoriesRepository } from './categories.repository';
import { UserCategory } from 'src/models/categories';
import {
  ICreateCategory,
  IUpdateCategory,
  IUserAndCategoryIds,
} from './interfaces';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async getAllUsersCategories({
    userId,
  }: {
    userId: number;
  }): Promise<UserCategory[]> {
    return this.categoriesRepository.getAll({ userId });
  }

  async createUsersCategory({
    data,
    userId,
  }: ICreateCategory): Promise<UserCategory> {
    return this.categoriesRepository.create({ data, userId });
  }

  async updateUsersCategory({
    data,
    categoryId,
    userId,
  }: IUpdateCategory): Promise<UserCategory> {
    return this.categoriesRepository.update({ data, categoryId, userId });
  }

  async deleteUsersCategory({
    categoryId,
    userId,
  }: IUserAndCategoryIds): Promise<void> {
    await this.categoriesRepository.delete({ categoryId, userId });
  }

  async getCategoryById({
    categoryId,
    userId,
  }: IUserAndCategoryIds): Promise<UserCategory> {
    return this.categoriesRepository.getById({ categoryId, userId });
  }
}
