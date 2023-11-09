import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { IRefreshPayload } from 'src/authentication/interfaces/jwt-interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CookieService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly databaseService: DatabaseService
  ) {}

  async ValidateRefreshTokenInCookie(request: Request): Promise<number> {
    try {
      const { cookies } = request;

      if (!cookies) throw new UnauthorizedException();

      const { jwt } = cookies;

      if (!jwt) throw new UnauthorizedException();

      const refreshToken = request.cookies.jwt;

      try {
        const { userId } = this.authenticationService.verifyRefreshToken(
          refreshToken
        ) as IRefreshPayload;

        if (!userId) throw new UnauthorizedException();

        const UserInstanceInDB = await this.databaseService.runQuery(
          `SELECT * FROM users WHERE id = ${userId}`
        );

        const user = UserInstanceInDB.rows[0];

        if (!user) {
          throw new UnauthorizedException('Unauthorized');
        }

        return user.id;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
