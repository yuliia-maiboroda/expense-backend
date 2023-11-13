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
import { TransactionsService } from './transactions.service';
import { RequestWithUserInterface } from 'src/common/interfaces';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/')
  @HttpCode(200)
  async getAll(@Req() req: RequestWithUserInterface) {
    return this.transactionsService.getAll(req.user.id);
  }

  @Post('/:categoryId/category')
  @HttpCode(201)
  async create(
    @Req() req: RequestWithUserInterface,
    @Param('categoryId') categoryId: number,
    @Body() transactionData: CreateTransactionDto
  ) {
    return this.transactionsService.create(
      transactionData,
      req.user.id,
      categoryId
    );
  }

  @Post('/:transactionId')
  @HttpCode(200)
  async update(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number,
    @Body() transactionData: UpdateTransactionDto
  ) {
    return this.transactionsService.update(
      transactionData,
      transactionId,
      req.user.id
    );
  }

  @Get('/:transactionId')
  @HttpCode(200)
  async getById(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number
  ) {
    return this.transactionsService.getById(transactionId, req.user.id);
  }

  @Delete('/:transactionId')
  @HttpCode(204)
  async delete(
    @Req() req: RequestWithUserInterface,
    @Param('transactionId') transactionId: number
  ) {
    await this.transactionsService.delete(transactionId, req.user.id);
  }
}
