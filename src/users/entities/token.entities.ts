import { ApiProperty } from '@nestjs/swagger';

export class TokenEntities {
  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken: string;
}
