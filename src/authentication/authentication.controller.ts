import { Controller } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(readonly authenticationService: AuthenticationService) {}
}
