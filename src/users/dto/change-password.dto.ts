import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password cannot be empty' })
  @IsString({ message: 'Old password must be a string' })
  @MinLength(5, {
    message: 'Old password must be at least 5 characters long',
  })
  @MaxLength(30, {
    message: 'Old password must be at most 30 characters long',
  })
  @Matches(/^\d*(?=.*[a-z])(?=.*[A-Z])\S+\D*\d*$/, {
    message:
      'Old password must contain at least one lowercase letter, one uppercase letter and one number',
  })
  @ApiProperty({
    description: 'Your old password',
    type: String,
    minimum: 5,
    maximum: 30,
    required: true,
  })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password cannot be empty' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(5, {
    message: 'New password must be at least 5 characters long',
  })
  @MaxLength(30, {
    message: 'New password must be at most 30 characters long',
  })
  @Matches(/^\d*(?=.*[a-z])(?=.*[A-Z])\S+\D*\d*$/, {
    message:
      'New password must contain at least one lowercase letter, one uppercase letter and one number',
  })
  @ApiProperty({
    description: 'Your new password',
    type: String,
    minimum: 5,
    maximum: 30,
    required: true,
  })
  newPassword: string;
}
