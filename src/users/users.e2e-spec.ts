import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { mockedUserLoginData, mockedUserRegisterData } from './__mocks__';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(mockedUserRegisterData)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');
  });

  it('/users/login (POST) - should login a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(mockedUserLoginData)
      .expect(200);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');
  });

  it('/users/logout (POST) - should logout a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/logout')
      .set('Authorization', `Bearer YOUR_ACCESS_TOKEN`)
      .expect(204);

    expect(response.body).toBeUndefined();
  });

  it('/users/refresh (POST) - should refresh a user token via cookies', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/refresh')
      .set('Cookie', [`refreshToken=YOUR_REFRESH_TOKEN`])
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');
  });

  it('/users/change-password (POST) - should change a user password', async () => {
    const newPasswordData = {
      oldPassword: '123Test',
      newPassword: '123Test',
    };

    const response = await request(app.getHttpServer())
      .post('/users/change-password')
      .set('Authorization', `Bearer YOUR_ACCESS_TOKEN`)
      .send(newPasswordData)
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');
  });
});
