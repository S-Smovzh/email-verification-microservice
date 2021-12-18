import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import i18next from "i18next";
import { GlobalErrorCodes } from "../exceptions/GlobalErrorCodes";
import { MailOptions } from "./interfaces/MailOptions";
import { VerifyDataDto } from "./dto/verify-data.dto";
import { emailTemplate } from "./email-template";

const nodemailer = require("nodemailer");

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.zoho.com",
    port: process.env.MAIL_PORT || 465,
    secure: true,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  async validateEmail(verifyDataDto: VerifyDataDto) {
    try {
      let type: "reset_password" | "verify_email" | "email" | "password" | "username" | "phone" | "", verificationLink: string;
      // const prefix = verifyDataDto.mailType === "VERIFY_EMAIL" ? "ver-" : "for-";
      switch (verifyDataDto.mailType) {
        case "RESET_PASSWORD":
          type = "reset_password";
          break;
        case "VERIFY_EMAIL":
          type = "verify_email";
          break;
        case "VERIFY_EMAIL_CHANGE":
          type = "email";
          break;
        case "VERIFY_PASSWORD_CHANGE":
          type = "password";
          break;
        case "VERIFY_USERNAME_CHANGE":
          type = "username";
          break;
        case "VERIFY_PHONE_CHANGE":
          type = "phone";
          break;
        default:
          type = "";
          verificationLink = "";
          break;
      }

      if (type === "verify_email" || type === "reset_password") {
        verificationLink = process.env.FRONT_URL.concat(
          `/verification/${type}/${Buffer.from(verifyDataDto.email).toString("base64")}/${Buffer.from(
            verifyDataDto.verificationCode
          ).toString("base64")}`
        );
      } else {
        verificationLink = process.env.FRONT_URL.concat(
          `/verification/${type}/${Buffer.from(verifyDataDto.verificationCode).toString("base64")}`
        );
      }

      const mailOptions: MailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: verifyDataDto.email,
        subject: i18next.t("email-subject"),
        text: `${i18next.t("email-welcome")}\n\n${i18next.t("email-guide")}\n\n${verificationLink}
        \n\n\n${i18next.t("email-credits")}\n\n www.chatiZZe.com`,
        html: emailTemplate(verificationLink, verifyDataDto.mailType)
      };

      this.transporter.sendMail(mailOptions, (e, info) => {
        if (e) {
          console.log(e);
        } else {
          console.log(`Verification email sent to ${verifyDataDto.email}: ${info.response}`);
          return HttpStatus.OK;
        }
      });
    } catch (e) {
      console.log(e.stack);
      return new RpcException({
        key: "INTERNAL_ERROR",
        code: GlobalErrorCodes.INTERNAL_ERROR.code,
        message: GlobalErrorCodes.INTERNAL_ERROR.value
      });
    }
  }
}
