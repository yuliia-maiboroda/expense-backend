import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';

// error :     Cannot find module 'src/database/database.service' from 'categories/categories.repository.ts'

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, CategoriesRepository, DatabaseService],
      imports: [DatabaseModule],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });
});
