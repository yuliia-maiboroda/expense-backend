import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, {
    message: 'Username must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Username must be at most 50 characters long',
  })
  @ApiProperty({
    description: 'Your unique username',
    type: String,
    minimum: 3,
    maximum: 50,
    required: true,
  })
  username: string;

  @IsNotEmpty({ message: 'Displayname cannot be empty' })
  @IsString({ message: 'Displayname must be a string' })
  @MinLength(3, {
    message: 'Displayname must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Displayname must be at most 50 characters long',
  })
  @ApiProperty({
    description: 'Your displayname',
    type: String,
    minimum: 3,
    maximum: 50,
    required: true,
  })
  displayname: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(5, {
    message: 'Password must be at least 5 characters long',
  })
  @MaxLength(30, {
    message: 'Password must be at most 30 characters long',
  })
  @Matches(/^\d*(?=.*[a-z])(?=.*[A-Z])\S+\D*\d*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter and one number',
  })
  @ApiProperty({
    description: 'Your password',
    type: String,
    minimum: 5,
    maximum: 30,
    required: true,
  })
  password: string;
}
