import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntities {
  @ApiProperty({
    description: 'Transaction id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Transaction label',
    type: String,
  })
  label: string;

  @ApiProperty({
    description: 'Transaction amount',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction date',
    type: Date,
  })
  date: Date;

  @ApiProperty({
    description: 'Transaction category id',
    type: Number,
  })
  category: number;

  @ApiProperty({
    description: 'Transaction user id',
    type: Number,
  })
  owner: number;
}
