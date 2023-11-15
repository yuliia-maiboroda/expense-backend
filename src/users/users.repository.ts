import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import { DatabaseService } from '../database/database.service';
import { ChangePasswordDto, UserLoginDto, UserRegistrationDto } from './dto';
import { User, UserProperties } from '../models/users/user.schema';
import { RETURNING_COLUMNS } from './constants';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create({
    userData,
  }: {
    userData: UserRegistrationDto;
  }): Promise<UserProperties> {
    const hashPassword = await bcrypt.hash(userData.password, 10);

    await this.ensureUniqueUsername(userData.username);

    const result = await this.databaseService.createUser({
      data: {
        ...userData,
        password: hashPassword,
      },
      returningColumns: RETURNING_COLUMNS,
    });

    await this.databaseService.setInitCategoriesForUser(result.id);

    return result;
  }

  async login({
    userData,
  }: {
    userData: UserLoginDto;
  }): Promise<UserProperties> {
    const user = await this.findUserByUsername(userData.username);

    if (!user) throw new UnauthorizedException();

    await this.validatePassword(userData.password, user.password);

    const result = await this.databaseService.updateUserSessionAndRefreshId({
      userId: user.id,
      returningColumns: RETURNING_COLUMNS,
    });

    return result;
  }

  async logout({ id }: { id: number }): Promise<void> {
    await this.databaseService.setSessionIdNull(id);
  }

  async refreshToken({ id }: { id: number }): Promise<UserProperties> {
    const user = await this.findUserById(id);

    return await this.databaseService.updateUserSessionAndRefreshId({
      userId: user.id,
      returningColumns: RETURNING_COLUMNS,
    });
  }

  async changePassword({
    id,
    data: { oldPassword, newPassword },
  }: {
    id: number;
    data: ChangePasswordDto;
  }): Promise<{ sessionid: string; refreshid: string }> {
    const userInstance = await this.findUserById(id);

    await this.validatePassword(oldPassword, userInstance.password);

    const hashPassword = await bcrypt.hash(newPassword, 10);

    return await this.databaseService.updateUserPassword({
      userId: id,
      password: hashPassword,
    });
  }

  private async ensureUniqueUsername(username: string): Promise<void> {
    const isUserWithUsername = await this.databaseService.findUserByUsername({
      username,
    });
    if (isUserWithUsername)
      throw new ConflictException('Username is already taken');
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    return await this.databaseService.findUserByUsername({ username });
  }

  private async findUserById(userId: number): Promise<User> {
    const user = await this.databaseService.findUserById({ userId });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  private async validatePassword(
    passFromData: string,
    passFromDB: string
  ): Promise<void> {
    const isValidPassword = await bcrypt.compare(passFromData, passFromDB);

    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
  }
}
