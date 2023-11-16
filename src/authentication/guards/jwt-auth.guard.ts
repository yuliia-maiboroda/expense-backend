import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthenticationService } from '../authentication.service';
import { DatabaseService } from '../../database/database.service';
import { IPayload } from '../interfaces/jwt-interface';
import { User } from '../../models/users';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: AuthenticationService,
    private readonly databaseService: DatabaseService
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();

    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }
    const headers = request.headers as Record<string, string>;

    const token = this.extractTokenFromHeaders(headers['authorization']);

    if (!token) throw new UnauthorizedException('Unauthorized');

    const decodedToken = this.verifyToken(token);

    const userInstanceInDB: User = await this.getUserFromDatabase(
      decodedToken.userId
    );

    this.validateUserSession(userInstanceInDB, decodedToken.sessionId);

    request.user = userInstanceInDB;

    return true;
  }

  private extractTokenFromHeaders(authorizationHeader: string): string | null {
    if (!authorizationHeader) return null;

    const [, token] = authorizationHeader.split(' ');

    return token || null;
  }

  private verifyToken(token: string): IPayload {
    try {
      const decodedToken = this.jwtService.verifyAccessToken(token);
      if (!decodedToken) throw new UnauthorizedException('Unauthorized');

      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private async getUserFromDatabase(userId: number) {
    const userInstanceInDB = await this.databaseService.findUserById({
      userId,
    });

    if (!userInstanceInDB) throw new UnauthorizedException('Unauthorized');

    return userInstanceInDB;
  }

  private validateUserSession(userInstanceInDB: User, sessionId: string): void {
    if (!userInstanceInDB.sessionid || userInstanceInDB.sessionid !== sessionId)
      throw new UnauthorizedException('Unauthorized');
  }
}
