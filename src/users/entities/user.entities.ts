import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from 'src/models/users';

class UserProperties {
  @ApiProperty({
    description: 'User id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'User username',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'User displayname',
    type: String,
  })
  displayname: string;

  @ApiProperty({
    description: 'User role',
    type: String,
  })
  role: string;
}

export class UserEntities {
  @ApiProperty({
    description: 'User properties',
    type: UserProperties,
  })
  user: {
    id: number;
    username: string;
    displayname: string;
    role: ROLES;
  };

  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken: string;
}
