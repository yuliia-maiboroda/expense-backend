import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { DatabaseModule } from '../src/database/database.module';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { DatabaseService } from '../src/database/database.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, AuthenticationModule],
      providers: [AuthenticationModule, DatabaseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
