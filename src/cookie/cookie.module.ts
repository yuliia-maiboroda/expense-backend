import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [AuthenticationModule],
  exports: [CookieService],
  providers: [CookieService, AuthenticationService],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CookieModule {}
