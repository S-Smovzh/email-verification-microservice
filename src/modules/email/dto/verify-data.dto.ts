import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { EmailTypeEnum } from "~/modules/enums";

export class VerifyDataDto {
  @IsNotEmpty()
  @IsUUID()
  readonly verificationCode: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsEnum(EmailTypeEnum)
  readonly mailType: EmailTypeEnum;
}
