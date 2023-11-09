import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { DatabaseModule } from 'src/database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [AuthenticationService],
  controllers: [],
})
export class AuthenticationModule {}
