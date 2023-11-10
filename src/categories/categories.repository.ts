import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserCategory } from 'src/models/categories';
import { UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll(userId: number): Promise<UserCategory[]> {
    const categories = await this.databaseService.getUsersCategories(userId);
    return categories;
  }

  async create(
    categoryData: CreateCategoryDto,
    userId: number
  ): Promise<UserCategory> {
    const existingUsersCategories =
      await this.databaseService.getUsersCategories(userId);

    const repeatedCategory = existingUsersCategories.find(
      category =>
        category.label === categoryData.label &&
        category.type === categoryData.type
    );

    if (repeatedCategory)
      throw new ConflictException('Category already exists');

    const category = await this.databaseService.createCategory(
      categoryData,
      userId
    );

    return category;
  }

  async update(
    categoryData: UpdateCategoryDto,
    categoryId: number,
    userId: number
  ): Promise<UserCategory> {
    const categoryInstance: UserCategory =
      await this.databaseService.getCategoryById(categoryId);

    if (!categoryInstance) throw new NotFoundException('Category not found');

    if (!categoryInstance.ismutable) throw new ForbiddenException('Forbidden');

    if (categoryInstance.owner !== userId)
      throw new ForbiddenException('Forbidden');

    const existingUsersCategories =
      await this.databaseService.getUsersCategories(userId);

    const repeatedCategory = existingUsersCategories.find(
      category =>
        category.label === categoryData.label &&
        category.type === categoryData.type
    );

    if (repeatedCategory)
      throw new ConflictException('Category already exists');

    const { label = categoryInstance.label, type = categoryInstance.type } =
      categoryData;

    const updatedCategory = await this.databaseService.updateCategory(
      { label, type },
      categoryId,
      userId
    );

    return updatedCategory;
  }
}
