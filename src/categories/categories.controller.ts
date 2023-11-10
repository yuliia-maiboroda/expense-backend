import {
  Body,
  Controller,
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

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(readonly categoriesService: CategoriesService) {}

  @Get('/')
  @HttpCode(200)
  async getAll(@Req() req: RequestWithUserInterface): Promise<UserCategory[]> {
    return this.categoriesService.getAllUsersCategories(req.user.id);
  }

  @Post('/')
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUserInterface,
    @Body() category: CreateCategoryDto
  ): Promise<UserCategory> {
    return this.categoriesService.createUsersCategory(category, req.user.id);
  }

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
}
