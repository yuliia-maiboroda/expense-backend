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
    return await this.databaseService.getUsersCategories(userId);
  }

  async create(
    categoryData: CreateCategoryDto,
    userId: number
  ): Promise<UserCategory> {
    await this.checkForDuplicateCategory(
      categoryData.label,
      categoryData.type,
      userId
    );

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
    const categoryInstance: UserCategory = await this.getCategoryInstance(
      categoryId,
      userId
    );

    this.checkForDuplicateCategory(
      categoryData.label,
      categoryData.type,
      userId,
      categoryId
    );

    await this.validateCategoryAction(categoryInstance);

    const { label = categoryInstance.label, type = categoryInstance.type } =
      categoryData;

    const updatedCategory = await this.databaseService.updateCategory(
      { label, type },
      categoryId,
      userId
    );

    return updatedCategory;
  }

  async delete(categoryId: number, userId: number): Promise<void> {
    const categoryInstance: UserCategory = await this.getCategoryInstance(
      categoryId,
      userId
    );

    await this.validateCategoryAction(categoryInstance);

    const dependentTransactions = await this.databaseService.getRowsFromTable(
      'transactions',
      'category',
      categoryId
    );

    if (dependentTransactions.length > 0) {
      this.handleDependentTransactions(categoryId, userId);
    }

    await this.databaseService.deleteRowFromTable(
      'categories',
      'id',
      categoryId
    );
  }
  async getById(categoryId: number, userId: number): Promise<UserCategory> {
    const categoryInstance: UserCategory = await this.getCategoryInstance(
      categoryId,
      userId
    );

    return categoryInstance;
  }

  private async getCategoryInstance(
    categoryId: number,
    userId: number
  ): Promise<UserCategory> {
    const categoryInstance =
      await this.databaseService.getCategoryById(categoryId);

    if (!categoryInstance) {
      throw new NotFoundException('Category not found');
    }

    if (categoryInstance.owner !== userId) {
      throw new ForbiddenException('Forbidden');
    }

    return categoryInstance;
  }

  private async validateCategoryAction(
    categoryInstance: UserCategory
  ): Promise<void> {
    if (!categoryInstance.ismutable) {
      throw new ForbiddenException(`Forbidden: `);
    }
  }
  private async checkForDuplicateCategory(
    label: string,
    type: string,
    userId: number,
    categoryId?: number
  ): Promise<void> {
    const existingUsersCategories =
      await this.databaseService.getUsersCategories(userId);

    const repeatedCategory = existingUsersCategories.find(
      category =>
        category.label === label &&
        category.type === type &&
        category.id !== categoryId
    );

    if (repeatedCategory) {
      throw new ConflictException('Category already exists');
    }
  }

  private async handleDependentTransactions(
    categoryId: number,
    userId: number
  ): Promise<void> {
    const newCategoryForDeletedTransactions =
      await this.databaseService.getDefaultUserCategory(userId);

    await this.databaseService.setNewCategoryForTransaction(
      newCategoryForDeletedTransactions.id,
      categoryId
    );
  }
}
