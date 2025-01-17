import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from '../authentication/authentication.service';
import { IRefreshPayload } from '../authentication/interfaces/jwt-interface';
import { DatabaseService } from '../database/database.service';
import { ISetCookieInterface } from './interfaces';
import { User } from '../models/users';

@Injectable()
export class CookieService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly databaseService: DatabaseService
  ) {}

  async validateRefreshTokenInCookie(request: Request): Promise<number> {
    try {
      const { jwt: refreshToken }: { jwt: string } = request.cookies as {
        jwt: string;
      };

      if (!refreshToken) throw new UnauthorizedException();

      const { userId, refreshId }: IRefreshPayload =
        this.verifyRefreshToken(refreshToken);

      const user: User = await this.databaseService.findUserById({ userId });

      if (!user) throw new UnauthorizedException('Unauthorized');

      if (user.refreshid !== refreshId)
        throw new UnauthorizedException('Unauthorized');

      return user.id;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private verifyRefreshToken(refreshToken: string): IRefreshPayload {
    try {
      const decodedToken =
        this.authenticationService.verifyRefreshToken(refreshToken);

      if (!decodedToken) throw new UnauthorizedException('Unauthorized');

      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  setCookie({ response, refreshToken }: ISetCookieInterface): void {
    response.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  unsetCookie(response: Response): void {
    response.clearCookie('jwt');
  }
}
