import { User } from 'src/models/users/user.schema';

export interface RequestWithUserInterface extends Request {
  user: User;
}
