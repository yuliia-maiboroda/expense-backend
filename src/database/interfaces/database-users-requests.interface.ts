import { UserRegistrationDto } from 'src/users/dto';

export interface IGetUserById {
  userId: number;
}

export interface IGetUserByUsername {
  username: string;
}

export interface ICreateUser {
  data: UserRegistrationDto;
  returningColumns?: string[];
}

export interface IUpdateSessions {
  userId: number;
  returningColumns?: string[];
}

export interface IUpdateUsersPassword {
  userId: number;
  password: string;
}
