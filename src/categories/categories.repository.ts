import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { UserCategory } from '../models/categories';
import {
  ICreateCategory,
  IUpdateCategory,
  IUserAndCategoryIds,
} from './interfaces';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll({ userId }: { userId: number }): Promise<UserCategory[]> {
    return await this.databaseService.getUsersCategories(userId);
  }

  async create({ data, userId }: ICreateCategory): Promise<UserCategory> {
    await this.checkForDuplicateCategory(data.label, data.type, userId);

    const category = await this.databaseService.createCategory({
      data,
      userId,
    });

    return category;
  }

  async update({
    data,
    categoryId,
    userId,
  }: IUpdateCategory): Promise<UserCategory> {
    const categoryInstance: UserCategory = await this.getCategoryInstance(
      categoryId,
      userId
    );
    const { label = categoryInstance.label, type = categoryInstance.type } =
      data;

    await this.checkForDuplicateCategory(label, type, userId, categoryId);

    this.validateCategoryAction(categoryInstance);

    const updatedCategory = await this.databaseService.updateCategory({
      data: { label, type },
      categoryId,
      userId,
    });

    return updatedCategory;
  }

  async delete({ categoryId, userId }: IUserAndCategoryIds): Promise<void> {
    const categoryInstance: UserCategory = await this.getCategoryInstance(
      categoryId,
      userId
    );

    this.validateCategoryAction(categoryInstance);

    const dependentTransactions = await this.databaseService.getRowsFromTable({
      table: 'transactions',
      label: 'category',
      value: categoryId,
    });

    if (dependentTransactions.length > 0) {
      await this.handleDependentTransactions(categoryId, userId);
    }

    await this.databaseService.deleteRowFromTable({
      table: 'categories',
      label: 'id',
      value: categoryId,
    });
  }

  async getById({
    categoryId,
    userId,
  }: IUserAndCategoryIds): Promise<UserCategory> {
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

    if (!categoryInstance) throw new NotFoundException();

    if (categoryInstance.owner !== userId) throw new ForbiddenException();

    return categoryInstance;
  }

  private validateCategoryAction(categoryInstance: UserCategory) {
    if (!categoryInstance.ismutable) throw new ForbiddenException();
  }

  private async checkForDuplicateCategory(
    label: string,
    type: string,
    userId: number,
    categoryId?: number
  ) {
    const existingUsersCategories =
      await this.databaseService.getUsersCategories(userId);

    const repeatedCategory = existingUsersCategories.find(
      category =>
        category.label?.toLowerCase() === label?.toLowerCase() &&
        category.type === type &&
        category.id !== categoryId
    );

    if (repeatedCategory)
      throw new ConflictException('Category already exists');
  }

  private async handleDependentTransactions(
    categoryId: number,
    userId: number
  ) {
    const newCategoryForDeletedTransactions =
      await this.databaseService.getDefaultUserCategory(userId);

    await this.databaseService.setNewCategoryForTransaction({
      newCategoryId: newCategoryForDeletedTransactions.id,
      oldCategoryid: categoryId,
    });
  }
}
