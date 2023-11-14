import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from 'src/database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AuthenticationService],
  controllers: [],
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthenticationModule {}
