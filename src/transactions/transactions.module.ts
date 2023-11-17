import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { AuthenticationService } from '../authentication/authentication.service';
import { TransactionsRepository } from './transactions.repository';

@Module({
  imports: [AuthenticationModule, DatabaseModule],
  providers: [
    TransactionsService,
    JwtAuthGuard,
    AuthenticationService,
    TransactionsRepository,
  ],
  controllers: [TransactionsController],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TransactionsModule {}
