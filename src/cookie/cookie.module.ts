import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  imports: [AuthenticationModule],
  exports: [CookieService],
  providers: [CookieService, AuthenticationService],
})
export class CookieModule {}
