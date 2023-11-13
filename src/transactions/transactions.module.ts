import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DatabaseModule } from 'src/database/database.module';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { AuthenticationService } from 'src/authentication/authentication.service';
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
export class TransactionsModule {}
