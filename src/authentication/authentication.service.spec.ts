import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticationService } from './authentication.service';

import {
  mockedAccessPayload,
  mockedAccessToken,
  mockedRefreshPayload,
  mockedRefreshToken,
} from './__mocks__';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    process.env['JWT_ACCESS_SECRET_KEY'] = 'mockedsecret';
    process.env['JWT_ACCESS_LIFETIME'] = '3600';
    process.env['JWT_REFRESH_SECRET_KEY'] = 'mockedrefreshsecret';
    process.env['JWT_REFRESH_LIFETIME'] = '86400';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            generateAccessToken: jest.fn().mockReturnValue(mockedAccessToken),
            generateRefreshToken: jest.fn().mockReturnValue(mockedRefreshToken),
            verifyAccessToken: jest.fn().mockReturnValue(mockedAccessPayload),
            verifyRefreshToken: jest.fn().mockReturnValue(mockedRefreshPayload),
          },
        },
      ],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService
    );
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const result =
        authenticationService.generateAccessToken(mockedAccessPayload);
      expect(result).toEqual(mockedAccessToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const result =
        authenticationService.generateRefreshToken(mockedRefreshPayload);
      expect(result).toEqual(mockedRefreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify an access token', () => {
      const result = authenticationService.verifyAccessToken(mockedAccessToken);
      expect(result).toEqual(mockedAccessPayload);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const result =
        authenticationService.verifyRefreshToken(mockedRefreshToken);
      expect(result).toEqual(mockedRefreshPayload);
    });
  });
});
