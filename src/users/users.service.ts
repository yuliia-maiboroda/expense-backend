import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersRepository } from './users.repository';
import { UserLoginDto, UserRegistrationDto } from './dto';
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

  async register(
    userData: UserRegistrationDto
  ): Promise<UserEntitiesWithToken> {
    const userInstanse: UserProperties =
      await this.usersRepository.create(userData);

    const accessToken = this.authenticationService.generateAccessToken({
      userId: userInstanse.id,
      sessionId: userInstanse.sessionid,
    });

    const refreshToken = this.authenticationService.generateRefreshToken({
      userId: userInstanse.id,
    });

    return {
      user: userInstanse,
      accessToken,
      refreshToken,
    };
  }

  async login(userData: UserLoginDto): Promise<UserEntitiesWithToken> {
    try {
      const userInstanse: UserProperties =
        await this.usersRepository.login(userData);

      const accessToken = this.authenticationService.generateAccessToken({
        userId: userInstanse.id,
        sessionId: userInstanse.sessionid,
      });

      const refreshToken = this.authenticationService.generateRefreshToken({
        userId: userInstanse.id,
      });

      return {
        user: userInstanse,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(id: number): Promise<void> {
    this.usersRepository.logout(id);
  }

  async refreshToken(
    request: Request
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const id = await this.cookieService.validateRefreshTokenInCookie(request);

    const userInstanse: UserProperties =
      await this.usersRepository.refreshToken(id);

    const accessToken = this.authenticationService.generateAccessToken({
      userId: userInstanse.id,
      sessionId: userInstanse.sessionid,
    });

    const refreshToken = this.authenticationService.generateRefreshToken({
      userId: userInstanse.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
