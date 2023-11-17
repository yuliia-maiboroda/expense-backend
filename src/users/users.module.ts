import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UsersRepository } from './users.repository';
import { AuthenticationService } from '../authentication/authentication.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CookieService } from '../cookie/cookie.service';
import { CookieModule } from '../cookie/cookie.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule, CookieModule],
  providers: [
    UsersService,
    UsersRepository,
    AuthenticationService,
    JwtAuthGuard,
    CookieService,
  ],
  controllers: [UsersController],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UsersModule {}
