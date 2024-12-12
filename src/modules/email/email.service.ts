import { ConfigService } from "@nestjs/config";
import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import i18next from "i18next";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { GLOBAL_ERROR_CODES, GlobalErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { EmailTypeEnum, LoggerService, MailConfigInterface, MailOptionsInterface } from "~/modules/common";
import { VerifyDataDto } from "./dto/verify-data.dto";
import { emailTemplate } from "./email.template";

@Injectable()
export class EmailService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  private readonly SENDER_EMAIL: string;
  private readonly SENDER_NAME: string;
  private readonly CLIENT_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    const { host, port, user, password, senderEmail, senderName } = this.configService.get<MailConfigInterface>("mailConfig");
    const clientUrl = this.configService.get<string>("app.clientUrl");

    this.transporter = createTransport({
      host: host || "smtp.zoho.com",
      port: port || 465,
      secure: true,
      requireTLS: true,
      auth: {
        user,
        pass: password
      }
    });

    this.SENDER_EMAIL = senderEmail;
    this.SENDER_NAME = senderName;
    this.CLIENT_URL = clientUrl;
  }

  async validateEmail(verifyDataDto: VerifyDataDto) {
    try {
      let type: "reset_password" | "verify_email" | "email" | "password" | "username" | "phone" | "", verificationLink: string;
      switch (verifyDataDto.mailType) {
        case EmailTypeEnum.RESET_PASSWORD:
          type = "reset_password";
          break;
        case EmailTypeEnum.VERIFY_EMAIL:
          type = "verify_email";
          break;
        case EmailTypeEnum.VERIFY_EMAIL_CHANGE:
          type = "email";
          break;
        case EmailTypeEnum.VERIFY_PASSWORD_CHANGE:
          type = "password";
          break;
        case EmailTypeEnum.VERIFY_USERNAME_CHANGE:
          type = "username";
          break;
        case EmailTypeEnum.VERIFY_TEL_CHANGE:
          type = "phone";
          break;
        default:
          type = "";
          verificationLink = "";
          break;
      }

      if (type === "verify_email" || type === "reset_password") {
        verificationLink = this.CLIENT_URL.concat(
          `/verification/${type}/${Buffer.from(verifyDataDto.email).toString("base64")}/${Buffer.from(
            verifyDataDto.verificationCode
          ).toString("base64")}`
        );
      } else {
        verificationLink = this.CLIENT_URL.concat(
          `/verification/${type}/${Buffer.from(verifyDataDto.verificationCode).toString("base64")}`
        );
      }

      const mailOptions: MailOptionsInterface = {
        from: `"${this.SENDER_NAME}" <${this.SENDER_EMAIL}>`,
        to: verifyDataDto.email,
        subject: i18next.t("email-subject"),
        text: `${i18next.t("email-welcome")}\n\n${i18next.t("email-guide")}\n\n${verificationLink}
        \n\n\n${i18next.t("email-credits")}\n\n www.chatterly.com`,
        html: emailTemplate(verificationLink, verifyDataDto.mailType)
      };

      this.transporter.sendMail(mailOptions, (error: any, info) => {
        if (error) {
          this.logger.error(error, error.trace);
        } else {
          this.logger.log(`Verification email sent to ${verifyDataDto.email}: ${info.response}`);
          return HttpStatus.OK;
        }
      });
    } catch (error) {
      this.logger.error(error, error.trace);
      const { httpCode, msg } = GLOBAL_ERROR_CODES.get(GlobalErrorCodesEnum.INTERNAL_SERVER_ERROR);
      throw new InternalServerErrorException({
        key: GlobalErrorCodesEnum.INTERNAL_SERVER_ERROR,
        code: httpCode,
        message: msg
      });
    }
  }
}