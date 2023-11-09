import { ApiProperty } from '@nestjs/swagger';

export class ResreshEntities {
  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken: string;
}
