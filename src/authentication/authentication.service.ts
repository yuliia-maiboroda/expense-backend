import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IPayload, IRefreshPayload } from './interfaces/jwt-interface';

@Injectable()
export class AuthenticationService {
  private readonly jwtAccessKey = process.env['JWT_ACCESS_SECRET_KEY'];
  private readonly jwtAccessLifetime = Number(
    process.env['JWT_ACCESS_LIFETIME']
  );
  private readonly jwtRefreshKey = process.env['JWT_REFRESH_SECRET_KEY'];
  private readonly jwtRefreshLifetime = Number(
    process.env['JWT_REFRESH_LIFETIME']
  );

  generateAccessToken(payload: IPayload) {
    if (!this.jwtAccessKey || !this.jwtAccessLifetime)
      throw new Error('JWT_ACCESS_SECRET_KEY is not set');

    return jwt.sign(payload, this.jwtAccessKey, {
      expiresIn: this.jwtAccessLifetime,
    });
  }

  generateRefreshToken(payload: IRefreshPayload) {
    if (!this.jwtRefreshKey || !this.jwtRefreshLifetime)
      throw new Error('JWT_REFRESH_SECRET_KEY is not set');

    return jwt.sign(payload, this.jwtRefreshKey, {
      expiresIn: this.jwtRefreshLifetime,
    });
  }

  verifyAccessToken(token: string) {
    if (!this.jwtAccessKey) throw new Error('JWT_ACCESS_SECRET_KEY is not set');

    return jwt.verify(token, this.jwtAccessKey) as IPayload;
  }

  verifyRefreshToken(token: string) {
    if (!this.jwtRefreshKey)
      throw new Error('JWT_REFRESH_SECRET_KEY is not set');

    return jwt.verify(token, this.jwtRefreshKey) as IRefreshPayload;
  }
}
