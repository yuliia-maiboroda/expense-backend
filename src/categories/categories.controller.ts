import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserCategory } from '../models/categories';
import { UpdateCategoryDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryEntities } from './entities';
import { User } from '../common/decorators';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Get all user categories',
  })
  @ApiResponse({
    status: 200,
    type: [CategoryEntities],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('/')
  @HttpCode(200)
  async getAll(@User('id') userId: number): Promise<UserCategory[]> {
    return this.categoriesService.getAllUsersCategories({
      userId,
    });
  }

  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiResponse({
    status: 201,
    type: CategoryEntities,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists',
  })
  @Post('/')
  @HttpCode(201)
  async create(
    @User('id') userId: number,
    @Body() category: CreateCategoryDto
  ): Promise<UserCategory> {
    return await this.categoriesService.createUsersCategory({
      data: category,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntities,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists',
  })
  @Post('/:categoryId')
  @HttpCode(200)
  async update(
    @User('id') userId: number,
    @Param('categoryId') categoryId: number,
    @Body() category: UpdateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.updateUsersCategory({
      data: category,
      categoryId,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @Delete('/:categoryId')
  @HttpCode(204)
  async delete(
    @User('id') userId: number,
    @Param('categoryId') categoryId: number
  ): Promise<void> {
    await this.categoriesService.deleteUsersCategory({
      categoryId,
      userId,
    });
  }

  @ApiOperation({
    summary: 'Get a category by id',
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntities,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @Get('/:categoryId')
  @HttpCode(200)
  async getById(
    @User('id') userId: number,
    @Param('categoryId') categoryId: number
  ): Promise<UserCategory> {
    return this.categoriesService.getCategoryById({
      categoryId,
      userId,
    });
  }
}
