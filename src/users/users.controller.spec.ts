import { Test, TestingModule } from '@nestjs/testing';
import { request, response } from 'express';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { CookieService } from '../cookie/cookie.service';

import { DatabaseModule } from '../database/database.module';

import { AuthenticationModule } from '../authentication/authentication.module';

import {
  mockedUserLoginData,
  mockedUserRegisterData,
  mockedUserWithToken,
} from './__mocks__';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [AuthenticationModule, DatabaseModule],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn().mockReturnValue(mockedUserWithToken),
            login: jest.fn().mockReturnValue(mockedUserWithToken),
            logout: jest.fn(),
            refreshToken: jest.fn().mockReturnValue({
              accessToken: 'mockedAccessToken',
            }),
            changePassword: jest.fn().mockReturnValue({
              accessToken: 'mockedAccessToken',
            }),
          },
        },
        {
          provide: CookieService,
          useValue: {
            setCookie: jest.fn(),
            unsetCookie: jest.fn(),
          },
        },
      ],
    }).compile();
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result = await usersController.register(
        mockedUserRegisterData,
        response
      );

      expect(result).toEqual(mockedUserWithToken);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = await usersController.login(mockedUserLoginData, response);

      expect(result).toEqual(mockedUserWithToken);
    });
  });

  describe('refreshToken', () => {
    it('should return access token', async () => {
      const result = await usersController.refresh(request, response);

      expect(result).toEqual({
        accessToken: 'mockedAccessToken',
      });
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const result = await usersController.changePassword(
        1,
        {
          oldPassword: 'test',
          newPassword: 'test',
        },
        response
      );
      expect(result).toEqual({
        accessToken: 'mockedAccessToken',
      });
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const result = await usersController.logout(1, response);

      expect(result).toBeUndefined();
    });
  });
});
