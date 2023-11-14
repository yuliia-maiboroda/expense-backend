import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { CategoriesModule } from './categories.module';

// error     Cannot find module 'src/authentication/guards/jwt-auth.guard' from 'categories/categories.controller.ts'

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;
  let categoriesRepository: CategoriesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        CategoriesRepository,
        AuthenticationService,
        JwtAuthGuard,
      ],
      imports: [AuthenticationModule, CategoriesModule],
    }).compile();
    categoriesController =
      moduleRef.get<CategoriesController>(CategoriesController);
    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
    expect(categoriesService).toBeDefined();
    expect(categoriesRepository).toBeDefined();
  });
});
