import { ApiProperty } from '@nestjs/swagger';
import { TYPE_OF_CATEGORY } from '../../models/categories';

export class CategoryEntities {
  @ApiProperty({
    description: 'Category id',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: 'Category label',
    type: String,
  })
  label!: string;

  @ApiProperty({
    description: 'Category type',
    enum: TYPE_OF_CATEGORY,
  })
  type!: keyof typeof TYPE_OF_CATEGORY;

  @ApiProperty({
    description: 'Category mutable',
    type: Boolean,
  })
  ismutable!: boolean;

  @ApiProperty({
    description: 'Category owner',
    type: Number,
  })
  owner!: number;
}
