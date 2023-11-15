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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import type { RequestWithUserInterface } from '../common/interfaces';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TransactionEntities } from './entities';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get all user transactions',
  })
  @ApiResponse({
    status: 200,
    type: [TransactionEntities],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('/')
  @HttpCode(200)
  async getAll(@Req() req: RequestWithUserInterface) {
    return this.transactionsService.getAll({ userId: req.user.id });
  }

  @ApiOperation({
    summary: 'Create a new transaction',
  })
  @ApiResponse({
    status: 201,
    type: TransactionEntities,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Transaction already exists',
  })
  @Post('/:categoryId/category')
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number,
    @Body() transactionData: CreateTransactionDto
  ) {
    return this.transactionsService.create({
      data: transactionData,
      userId: req.user.id,
      categoryId,
    });
  }

  @ApiOperation({
    summary: 'Update a transaction',
  })
  @ApiResponse({
    status: 200,
    type: TransactionEntities,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
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
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Transaction already exists',
  })
  @Post('/:transactionId')
  @HttpCode(200)
  async update(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number,
    @Body() transactionData: UpdateTransactionDto
  ) {
    return this.transactionsService.update({
      data: transactionData,
      transactionId,
      userId: req.user.id,
    });
  }

  @ApiOperation({
    summary: 'Get a transaction by id',
  })
  @ApiResponse({
    status: 200,
    type: TransactionEntities,
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
    description: 'Transaction not found',
  })
  @Get('/:transactionId')
  @HttpCode(200)
  async getById(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number
  ) {
    return this.transactionsService.getById({
      transactionId,
      userId: req.user.id,
    });
  }

  @ApiOperation({
    summary: 'Delete a transaction',
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
    description: 'Transaction not found',
  })
  @Delete('/:transactionId')
  @HttpCode(204)
  async delete(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number
  ) {
    await this.transactionsService.delete({
      transactionId,
      userId: req.user.id,
    });
  }
}
