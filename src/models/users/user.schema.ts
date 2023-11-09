import { ROLES } from 'src/models/users';

export class User {
  id: number;
  username: string;
  displayname: string;
  role: ROLES;
  password: string;
  sessionid: string;
}

export class UserProperties {
  id: number;
  username: string;
  displayname: string;
  role: ROLES;
  sessionid: string;
}

export class UserEntitiesWithToken {
  user: UserProperties;
  accessToken: string;
  refreshToken: string;
}
