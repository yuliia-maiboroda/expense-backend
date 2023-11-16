import { UserProperties } from '../../models/users';
import { UserLoginDto, UserRegistrationDto } from '../dto';
import { UserEntities } from '../entities';

export const mockedUser: UserProperties = {
  id: 1,
  username: 'test',
  displayname: 'test',
  role: 'user',
  sessionid: 'tested',
  refreshid: 'tested',
};

export const mockedUserWithToken: UserEntities = {
  user: {
    id: 1,
    username: 'test',
    displayname: 'test',
    role: 'user',
  },
  accessToken: 'test',
};

export const mockedUserRegisterData: UserRegistrationDto = {
  username: 'test',
  displayname: 'test',
  password: '123Ttest',
};

export const mockedUserLoginData: UserLoginDto = {
  username: 'test',
  password: '123Test',
};
