import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TYPE_OF_CATEGORY } from '../../models/categories';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: 'Category label must be a string' })
  @IsNotEmpty({ message: 'Category label cannot be empty' })
  @MinLength(3, {
    message: 'Category label must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Category label must be at most 50 characters long',
  })
  @ApiProperty({
    description: 'Category label',
    type: String,
    minimum: 3,
    maximum: 50,
    required: false,
  })
  label?: string;

  @IsOptional()
  @IsEnum(TYPE_OF_CATEGORY, {
    message: 'Category type must be either income or expense',
  })
  @ApiProperty({
    description: 'Category type',
    enum: TYPE_OF_CATEGORY,
    required: false,
  })
  type?: keyof typeof TYPE_OF_CATEGORY;
}
