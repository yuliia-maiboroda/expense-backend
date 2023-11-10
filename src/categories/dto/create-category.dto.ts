import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TYPE_OF_CATEGORY } from 'src/models/categories';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @IsString({ message: 'Category name must be a string' })
  @MinLength(3, {
    message: 'Category name must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Category name must be at most 50 characters long',
  })
  @ApiProperty({
    description: 'Category name',
    type: String,
    minimum: 3,
    maximum: 50,
    required: true,
  })
  label: string;

  @IsNotEmpty({ message: 'Category type cannot be empty' })
  @IsEnum(TYPE_OF_CATEGORY, {
    message: 'Category type must be either income or expense',
  })
  @ApiProperty({
    description: 'Category type',
    enum: TYPE_OF_CATEGORY,
    required: true,
  })
  type: keyof typeof TYPE_OF_CATEGORY;
}
