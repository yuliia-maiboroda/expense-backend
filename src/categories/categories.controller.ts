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
import { RequestWithUserInterface } from 'src/common/interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserCategory } from 'src/models/categories';
import { UpdateCategoryDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryEntities } from './entities';

@ApiTags('Categories')
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
  @Get('/')
  @HttpCode(200)
  async getAll(@Req() req: RequestWithUserInterface): Promise<UserCategory[]> {
    return this.categoriesService.getAllUsersCategories(req.user.id);
  }

  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiResponse({
    status: 201,
    type: CategoryEntities,
  })
  @Post('/')
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUserInterface,
    @Body() category: CreateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.createUsersCategory(category, req.user.id);
  }

  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntities,
  })
  @Post('/:categoryId')
  @HttpCode(200)
  async update(
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number,
    @Body() category: UpdateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.updateUsersCategory(
      category,
      categoryId,
      req.user.id
    );
  }

  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiResponse({
    status: 204,
  })
  @Delete('/:categoryId')
  @HttpCode(204)
  async delete(
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number
  ): Promise<void> {
    await this.categoriesService.deleteUsersCategory(categoryId, req.user.id);
  }

  @ApiOperation({
    summary: 'Get a category by id',
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntities,
  })
  @Get('/:categoryId')
  @HttpCode(200)
  async getById(
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number
  ): Promise<UserCategory> {
    return this.categoriesService.getCategoryById(categoryId, req.user.id);
  }
}
