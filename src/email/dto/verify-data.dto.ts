import { IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VerifyDataDto {
  @IsNotEmpty()
  @IsUUID()
  readonly verificationCode: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly mailType:
    | "VERIFY_EMAIL"
    | "RESET_PASSWORD"
    | "VERIFY_EMAIL_CHANGE"
    | "VERIFY_USERNAME_CHANGE"
    | "VERIFY_PHONE_CHANGE"
    | "VERIFY_PASSWORD_CHANGE";
}
