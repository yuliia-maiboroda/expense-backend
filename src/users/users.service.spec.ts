import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

import { CookieService } from '../cookie/cookie.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let cookieService: CookieService;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
      providers: [
        UsersService,
        {
          provide: CookieService,
          useValue: {
            setCookie: jest.fn(),
            unsetCookie: jest.fn(),
            validateRefreshTokenInCookie: jest.fn().mockReturnValue(1),
            verifyRefreshToken: jest.fn().mockReturnValue({
              userId: 1,
              refreshId: 'tested',
            }),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            generateAccessToken: jest.fn().mockReturnValue('mockedAccessToken'),
            generateRefreshToken: jest
              .fn()
              .mockReturnValue('mockedRefreshToken'),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn().mockReturnValue({
              id: 1,
              username: 'test',
              displayname: 'test',
              role: 'user',
              sessionid: 'tested',
              refreshid: 'tested',
            }),
            login: jest.fn().mockReturnValue({
              id: 1,
              username: 'test',
              displayname: 'test',
              role: 'user',
              sessionid: 'tested',
              refreshid: 'tested',
            }),
            logout: jest.fn(),
            refreshToken: jest.fn().mockReturnValue({
              accessToken: 'mockedAccessToken',
              refreshToken: 'mockedRefreshToken',
            }),
            changePassword: jest.fn().mockReturnValue({
              accessToken: 'mockedAccessToken',
              refreshToken: 'mockedRefreshToken',
            }),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    cookieService = module.get<CookieService>(CookieService);
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result = await usersService.register({
        userData: {
          username: 'test',
          password: 'test',
          displayname: 'test',
        },
      });

      expect(result).toEqual({
        user: {
          id: 1,
          username: 'test',
          displayname: 'test',
          role: 'user',
        },
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const result = await usersService.login({
        userData: {
          username: 'test',
          password: 'test',
        },
      });

      expect(result).toEqual({
        user: {
          id: 1,
          username: 'test',
          displayname: 'test',
          role: 'user',
        },
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      });
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const result = await usersService.logout({
        userId: 1,
      });

      expect(result).toBeUndefined();
    });
  });

  describe('changePassword', () => {
    it('should change a user password', async () => {
      const result = await usersService.changePassword({
        id: 1,
        data: {
          oldPassword: 'test',
          newPassword: 'test',
        },
      });

      expect(result).toEqual({
        accessToken: 'mockedAccessToken',
        refreshToken: 'mockedRefreshToken',
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const mockRequest: Partial<Request> = {};
      const mockId = 1;

      jest
        .spyOn(cookieService, 'validateRefreshTokenInCookie')
        .mockResolvedValueOnce(mockId);
      jest.spyOn(usersService, 'refreshToken').mockResolvedValueOnce({
        accessToken: 'someAccessToken',
        refreshToken: 'someRefreshToken',
      });
      jest
        .spyOn(authenticationService, 'generateAccessToken')
        .mockReturnValueOnce('someAccessToken');
      jest
        .spyOn(authenticationService, 'generateRefreshToken')
        .mockReturnValueOnce('someRefreshToken');

      const result = await usersService.refreshToken(mockRequest as Request);

      expect(result).toEqual({
        accessToken: 'someAccessToken',
        refreshToken: 'someRefreshToken',
      });
    });

    it('should throw an error if validateRefreshTokenInCookie fails', async () => {
      const mockRequest: Partial<Request> = {};

      jest
        .spyOn(cookieService, 'validateRefreshTokenInCookie')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(
        usersService.refreshToken(mockRequest as Request)
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
