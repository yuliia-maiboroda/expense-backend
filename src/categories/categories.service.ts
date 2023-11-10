import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserCategory } from 'src/models/categories';
import { UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async getAllUsersCategories(userId: number): Promise<UserCategory[]> {
    return this.categoriesRepository.getAll(userId);
  }

  async createUsersCategory(
    data: CreateCategoryDto,
    userId: number
  ): Promise<UserCategory> {
    return this.categoriesRepository.create(data, userId);
  }

  async updateUsersCategory(
    data: UpdateCategoryDto,
    categoryId: number,
    userId: number
  ): Promise<UserCategory> {
    return this.categoriesRepository.update(data, categoryId, userId);
  }
}
