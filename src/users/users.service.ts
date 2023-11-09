import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserRegistrationDto } from './dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authenticationService: AuthenticationService
  ) {}

  async register(userData: UserRegistrationDto) {
    const userInstanse: User = await this.usersRepository.create(userData);

    const accessToken = this.authenticationService.generateAccessToken({
      userId: userInstanse.id,
      sessionId: userInstanse.sessionId,
    });

    return {
      user: userInstanse,
      accessToken,
    };
  }
}
