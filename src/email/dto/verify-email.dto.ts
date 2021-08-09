import { IsDefined, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VerifyEmailDto {
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
  readonly mailType: "VERIFY_EMAIL" | "RESET_PASSWORD";
}
