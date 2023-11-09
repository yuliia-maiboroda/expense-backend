import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: AuthenticationService,
    private readonly databaseService: DatabaseService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const decodedToken = this.jwtService.verifyAccessToken(token);

    if (!decodedToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { sessionId, userId } = decodedToken;

    const UserInstanceInDB = await this.databaseService.runQuery(
      `SELECT * FROM users WHERE id = ${userId}`
    );

    const user = UserInstanceInDB.rows[0];

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user.sessionid) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (user.sessionid !== sessionId) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.user = user;

    return true;
  }
}
