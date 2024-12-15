import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { EmailTypeEnum } from "@ssmovzh/chatterly-common-utils";

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
