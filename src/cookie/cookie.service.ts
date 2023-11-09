import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { IRefreshPayload } from 'src/authentication/interfaces/jwt-interface';
import { DatabaseService } from 'src/database/database.service';
import { ISetCookieInterface } from './interfaces';

@Injectable()
export class CookieService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly databaseService: DatabaseService
  ) {}

  async validateRefreshTokenInCookie(request: Request): Promise<number> {
    try {
      const { jwt: refreshToken } = request.cookies;

      if (!refreshToken) {
        throw new UnauthorizedException();
      }

      const { userId } = this.verifyRefreshToken(refreshToken);

      const user = await this.databaseService.findUserById(userId);

      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }

      return user.id;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private verifyRefreshToken(refreshToken: string): IRefreshPayload {
    return this.authenticationService.verifyRefreshToken(
      refreshToken
    ) as IRefreshPayload;
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
