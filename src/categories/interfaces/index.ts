import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

export interface ICreateCategory {
  data: CreateCategoryDto;
  userId: number;
}

export interface IUpdateCategory {
  data: UpdateCategoryDto;
  categoryId: number;
  userId: number;
}

export interface IUserAndCategoryIds {
  userId: number;
  categoryId: number;
}
