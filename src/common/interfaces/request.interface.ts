import { User } from '../../models/users';

export interface RequestWithUserInterface extends Request {
  user: User;
}
