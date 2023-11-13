import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersRepository } from './users.repository';
import { ChangePasswordDto, UserLoginDto, UserRegistrationDto } from './dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import {
  UserEntitiesWithToken,
  UserProperties,
} from '../models/users/user.schema';
import { CookieService } from 'src/cookie/cookie.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly cookieService: CookieService
  ) {}

  async register({
    userData,
  }: {
    userData: UserRegistrationDto;
  }): Promise<UserEntitiesWithToken> {
    const userInstanse: UserProperties = await this.usersRepository.create({
      userData,
    });

    const accessToken = this.authenticationService.generateAccessToken({
      userId: userInstanse.id,
      sessionId: userInstanse.sessionid,
    });

    const refreshToken = this.authenticationService.generateRefreshToken({
      userId: userInstanse.id,
      refreshId: userInstanse.refreshid,
    });

    return {
      user: {
        id: userInstanse.id,
        username: userInstanse.username,
        displayname: userInstanse.displayname,
        role: userInstanse.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login({
    userData,
  }: {
    userData: UserLoginDto;
  }): Promise<UserEntitiesWithToken> {
    try {
      const userInstanse: UserProperties = await this.usersRepository.login({
        userData,
      });

      const accessToken = this.authenticationService.generateAccessToken({
        userId: userInstanse.id,
        sessionId: userInstanse.sessionid,
      });

      const refreshToken = this.authenticationService.generateRefreshToken({
        userId: userInstanse.id,
        refreshId: userInstanse.refreshid,
      });

      return {
        user: {
          id: userInstanse.id,
          username: userInstanse.username,
          displayname: userInstanse.displayname,
          role: userInstanse.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout({ userId }: { userId: number }): Promise<void> {
    this.usersRepository.logout({ id: userId });
  }

  async refreshToken(
    request: Request
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const id = await this.cookieService.validateRefreshTokenInCookie(request);

    const userInstanse: UserProperties =
      await this.usersRepository.refreshToken({ id });

    const accessToken = this.authenticationService.generateAccessToken({
      userId: userInstanse.id,
      sessionId: userInstanse.sessionid,
    });

    const refreshToken = this.authenticationService.generateRefreshToken({
      userId: userInstanse.id,
      refreshId: userInstanse.refreshid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async changePassword({
    id,
    data: { oldPassword, newPassword },
  }: {
    id: number;
    data: ChangePasswordDto;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshAndSessionId = await this.usersRepository.changePassword({
      id,
      data: {
        oldPassword,
        newPassword,
      },
    });

    const accessToken = this.authenticationService.generateAccessToken({
      userId: id,
      sessionId: refreshAndSessionId.sessionid,
    });

    const refreshToken = this.authenticationService.generateRefreshToken({
      userId: id,
      refreshId: refreshAndSessionId.refreshid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
