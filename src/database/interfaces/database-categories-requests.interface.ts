import { CreateCategoryDto, UpdateCategoryDto } from 'src/categories/dto';

export interface ICreateCategory {
  data: CreateCategoryDto;
  userId: number;
}

export interface IUpdateCategory {
  data: UpdateCategoryDto;
  categoryId: number;
  userId: number;
}

export interface ISetNewCategoryForTransaction {
  newCategoryId: number;
  oldCategoryid: number;
}
