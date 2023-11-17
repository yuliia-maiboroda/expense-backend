import { Module } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { CategoriesRepository } from './categories.repository';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [DatabaseModule, AuthenticationModule],
  providers: [
    CategoriesService,
    CategoriesRepository,
    JwtAuthGuard,
    AuthenticationService,
  ],
  controllers: [CategoriesController],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CategoriesModule {}
