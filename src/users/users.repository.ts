import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserRegistrationDto } from './dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: UserRegistrationDto) {
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
}
