import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UsersRepository } from './users.repository';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  imports: [DatabaseModule, AuthenticationModule],
  providers: [UsersService, UsersRepository, AuthenticationService],
  controllers: [UsersController],
})
export class UsersModule {}
