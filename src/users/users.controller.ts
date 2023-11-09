import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistrationDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() user: UserRegistrationDto) {
    return this.usersService.register(user);
  }
}
