import { ApiProperty } from '@nestjs/swagger';
import { ROLE_OF_USER } from 'src/models/users';

class UserProperties {
  @ApiProperty({
    description: 'User id',
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: 'User username',
    type: String,
  })
  username!: string;

  @ApiProperty({
    description: 'User displayname',
    type: String,
  })
  displayname!: string;

  @ApiProperty({
    description: 'User role',
    enum: ROLE_OF_USER,
  })
  role!: keyof typeof ROLE_OF_USER;
}

export class UserEntities {
  @ApiProperty({
    description: 'User properties',
    type: UserProperties,
  })
  user!: {
    id: number;
    username: string;
    displayname: string;
    role: keyof typeof ROLE_OF_USER;
  };

  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken!: string;
}
