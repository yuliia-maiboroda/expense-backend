import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import type { RequestWithUserInterface } from 'src/common/interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserCategory } from 'src/models/categories';
import { UpdateCategoryDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryEntities } from './entities';

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
  async getAll(@Req() req: RequestWithUserInterface): Promise<UserCategory[]> {
    return this.categoriesService.getAllUsersCategories({
      userId: req.user.id,
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
    @Req() req: RequestWithUserInterface,
    @Body() category: CreateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.createUsersCategory({
      data: category,
      userId: req.user.id,
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
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number,
    @Body() category: UpdateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.updateUsersCategory({
      data: category,
      categoryId: categoryId,
      userId: req.user.id,
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
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number
  ): Promise<void> {
    await this.categoriesService.deleteUsersCategory({
      categoryId,
      userId: req.user.id,
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
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number
  ): Promise<UserCategory> {
    return this.categoriesService.getCategoryById({
      categoryId,
      userId: req.user.id,
    });
  }
}
