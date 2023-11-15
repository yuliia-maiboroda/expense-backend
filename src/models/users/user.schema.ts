import { ROLE_OF_USER } from './constants';

export class User {
  id!: number;
  username!: string;
  displayname!: string;
  role!: keyof typeof ROLE_OF_USER;
  password!: string;
  sessionid!: string;
  refreshid!: string;
}

export class UserProperties {
  id!: number;
  username!: string;
  displayname!: string;
  role!: keyof typeof ROLE_OF_USER;
  sessionid!: string;
  refreshid!: string;
}

export class UserVisibleProperties {
  id!: number;
  username!: string;
  displayname!: string;
  role!: keyof typeof ROLE_OF_USER;
}

export class UserEntitiesWithToken {
  user!: UserVisibleProperties;
  accessToken!: string;
  refreshToken!: string;
}
