import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UsersModel } from '../../models/users';
import { RequestWithUserInterface } from '../interfaces';

export const User = createParamDecorator(
  (data: keyof UsersModel, ctx: ExecutionContext) => {
    const request: RequestWithUserInterface = ctx.switchToHttp().getRequest();
    const user: UsersModel = request.user;

    return data ? user?.[data] : user;
  }
);
