import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CategoriesModule } from './categories.module';
import { isGuarded } from '../test/utils';
import { UserCategory } from '../models/categories';
import { RequestWithUserInterface } from '../common/interfaces';
import { User } from '../models/users';
const httpMocks = require('node-mocks-http');

// error     Cannot find module 'src/authentication/guards/jwt-auth.guard' from 'categories/categories.controller.ts'

class mockUserRequest extends Request implements RequestWithUserInterface {
  user: User = {
    id: 1,
    username: 'test',
    displayname: 'test',
    role: 'user',
    sessionid: '',
    refreshid: '',
    password: '',
  };
}

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
      imports: [AuthenticationModule, CategoriesModule],
    }).compile();
    categoriesController =
      moduleRef.get<CategoriesController>(CategoriesController);
    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  it('should be protected with JwtAuthGuard', () => {
    expect(isGuarded(CategoriesController, JwtAuthGuard)).toBe(true);
  });

  describe('getAll', () => {
    it('should return all user categories', async () => {
      const mockUserCategories: UserCategory[] = [];

      const req = httpMocks.createRequest(mockUserRequest);

      jest
        .spyOn(categoriesService, 'getAllUsersCategories')
        .mockResolvedValue(mockUserCategories);

      const result = await categoriesController.getAll(req);

      expect(result).toEqual(mockUserCategories);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const mockedCategory: UserCategory = {
        id: 1,
        label: 'test',
        type: 'income',
        owner: 1,
        ismutable: true,
      };

      const req = httpMocks.createRequest(mockUserRequest);

      jest
        .spyOn(categoriesService, 'createUsersCategory')
        .mockResolvedValue(mockedCategory);

      const result = await categoriesController.create(req, {
        label: 'test',
        type: 'income',
      });

      expect(result).toEqual(mockedCategory);
    });

    describe('update user category', () => {
      it('should update a category', async () => {
        const mockedCategory: UserCategory = {
          id: 1,
          label: 'test',
          type: 'income',
          owner: 1,
          ismutable: true,
        };

        const req = httpMocks.createRequest(mockUserRequest);
        req.params = {
          categoryId: 1,
        };

        req.body = {
          label: 'test',
          type: 'income',
        };

        const result = await categoriesController.update(
          req,
          req.params,
          req.body
        );
        expect(result).toEqual(mockedCategory);
      });
    });

    describe('delete user category', () => {
      it('should delete a category', async () => {
        const req = httpMocks.createRequest(mockUserRequest);
        req.params = {
          categoryId: 1,
        };

        await categoriesController.delete(req, req.params);
      });
    });
  });
});
