import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';
import { UserLoginDto, UserRegistrationDto } from './dto';
import { UserProperties } from '../models/users/user.schema';
import { RETURNING_COLUMNS } from './constants';
import { DatabaseErrorException } from 'src/common/helpers';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: UserRegistrationDto): Promise<UserProperties> {
    try {
      const hashPassword = await bcrypt.hash(userData.password, 10);

      const isUserWithUsername = await this.databaseService.findUserByUsername(
        userData.username
      );

      if (isUserWithUsername) throw new ConflictException();

      const result = await this.databaseService.createUser(
        {
          ...userData,
          password: hashPassword,
        },
        RETURNING_COLUMNS
      );

      return result;
    } catch (error) {
      throw new DatabaseErrorException();
    }
  }

  async login(userData: UserLoginDto): Promise<UserProperties> {
    try {
      const isUserWithUsername = await this.databaseService.findUserByUsername(
        userData.username
      );

      if (!isUserWithUsername) throw new NotFoundException();

      const isValidPassword = await bcrypt.compare(
        userData.password,
        isUserWithUsername.password
      );

      if (!isValidPassword) throw new UnauthorizedException();

      const result = await this.databaseService.updateUserSessionId(
        isUserWithUsername.id,
        RETURNING_COLUMNS
      );

      return result;
    } catch (error) {
      throw new DatabaseErrorException();
    }
  }

  async logout(id: number): Promise<void> {
    try {
      await this.databaseService.updateUserSessionId(id);
    } catch (error) {
      throw new DatabaseErrorException();
    }
  }

  async refreshToken(id: number): Promise<UserProperties> {
    try {
      const userInstanseOrNull = await this.databaseService.findUserById(id);

      if (!userInstanseOrNull) throw new NotFoundException();

      if (!userInstanseOrNull.sessionid) throw new UnauthorizedException();

      const result = await this.databaseService.updateUserSessionId(id);

      return result;
    } catch (error) {
      throw new DatabaseErrorException();
    }
  }
}
