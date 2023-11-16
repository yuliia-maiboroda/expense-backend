import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

import { CookieService } from '../cookie/cookie.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthenticationModule } from '../authentication/authentication.module';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
      providers: [
        UsersService,
        CookieService,
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

    // todo finish that testing

    // describe('refreshToken', () => {
    //   it('should refresh a user token', async () => {});
    // });
  });
});
