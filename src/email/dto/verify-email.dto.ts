import { IsDefined, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Verification code assigned to user to verify email.',
    format: 'uuid',
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  readonly verificationCode: string;

  @ApiProperty({
    example: 'petroshrekovenko@gmail.com',
    description: 'The email of the newly registered User.',
    format: 'email',
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
