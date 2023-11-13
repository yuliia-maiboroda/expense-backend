import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Label cannot be empty' })
  @IsString({ message: 'Label must be a string' })
  @MinLength(3, { message: 'Label must be at least 3 characters long' })
  @MaxLength(50, { message: 'Label must be at most 50 characters long' })
  @ApiProperty({
    description: 'Transaction label',
    type: String,
    minimum: 3,
    maximum: 50,
    required: true,
  })
  label: string;

  @IsNotEmpty({ message: 'Amount cannot be empty' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @ApiProperty({
    description: 'Transaction amount',
    type: Number,
    required: true,
  })
  amount: number;

  @IsOptional()
  @IsNotEmpty({ message: 'Date cannot be empty' })
  @ApiProperty({
    description: 'Transaction date',
    type: Date,
    required: false,
  })
  date?: Date;
}
