import { User } from 'src/users/schema/user.schema';

export interface RequestWithUserInterface extends Request {
  user: User;
}
