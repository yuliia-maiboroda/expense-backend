import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserLoginDto, UserRegistrationDto } from './dto';
import bcrypt from 'bcrypt';
import { UserProperties } from './schema/user.schema';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: UserRegistrationDto): Promise<UserProperties> {
    try {
      const hashPassword = await bcrypt.hash(userData.password, 10);

      // todo make the same select on jwt guards

      const isUserWithUsername = await this.databaseService.runQuery(
        'SELECT * FROM users WHERE username = $1;',
        [userData.username]
      );

      if (isUserWithUsername.rows[0]) throw new ConflictException();

      const result = await this.databaseService.runQuery(
        "INSERT INTO users (username, displayname, password, sessionId, role) VALUES ($1, $2, $3, uuid_generate_v4(), 'user') RETURNING *;",
        [userData.username, userData.displayname, hashPassword]
      );

      return result.rows[0];
    } catch (error) {
      console.log(error);
      // todo add custom error database

      throw error;
    }
  }

  async login(userData: UserLoginDto): Promise<UserProperties> {
    try {
      const user = await this.databaseService.runQuery(
        'SELECT * FROM users WHERE username = $1;',
        [userData.username]
      );

      if (!user.rows[0]) throw new NotFoundException();

      const isValidPassword = await bcrypt.compare(
        userData.password,
        user.rows[0].password
      );

      if (!isValidPassword) throw new UnauthorizedException();

      const result = await this.databaseService.runQuery(
        'UPDATE users SET sessionId = uuid_generate_v4() WHERE id = $1 RETURNING *',
        [user.rows[0].id]
      );

      return result.rows[0];
    } catch (error) {
      console.log(error);
      // todo add custom error database

      throw error;
    }
  }

  async logout(id: number): Promise<void> {
    try {
      await this.databaseService.runQuery(
        'UPDATE users SET sessionId = null WHERE id = $1 RETURNING *',
        [id]
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async refreshToken(id: number): Promise<UserProperties> {
    try {
      const user = await this.databaseService.runQuery(
        'SELECT * FROM users WHERE id = $1;',
        [id]
      );

      if (!user.rows[0]) throw new NotFoundException();

      if (!user.rows[0].sessionid) throw new UnauthorizedException();

      const result = await this.databaseService.runQuery(
        'UPDATE users SET sessionId = uuid_generate_v4() WHERE id = $1 RETURNING *',
        [id]
      );

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
