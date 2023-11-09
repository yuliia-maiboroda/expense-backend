import { ROLES } from 'src/models/users';

export class User {
  id: number;
  username: string;
  displayname: string;
  role: ROLES;
  password: string;
  sessionId: string;
}
