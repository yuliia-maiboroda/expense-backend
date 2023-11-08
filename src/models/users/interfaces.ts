import { ROLES } from '.';
import { ICategory } from '../categories';
import { ITransaction } from '../transactions';

export interface IUser {
  id: number;
  username: string;
  displayname: string;
  role: ROLES;
  password: string;
  sessionId: string;
  categories: ICategory[];
  transactions: ITransaction[];
}
