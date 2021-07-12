import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import i18next from "i18next";
import { GlobalErrorCodes } from "../exceptions/GlobalErrorCodes";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { MailOptions } from "./interfaces/MailOptions";
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

  async validateEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const prefix = verifyEmailDto.mailType === "VERIFY_EMAIL" ? "ver-" : "for-";

      const verificationLink = process.env.FRONT_URL.concat(
        `/verification/${Buffer.from(verifyEmailDto.email).toString("base64")}/${Buffer.from(verifyEmailDto.verificationCode).toString(
          "base64"
        )}`
      );

      const mailOptions: MailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
        to: verifyEmailDto.email,
        subject: i18next.t(`${prefix}email-subject`),
        text: `${i18next.t(`${prefix}email-welcome`)}\n\n${i18next.t(`${prefix}email-guide`)}\n\n${verificationLink}
        \n\n\n${i18next.t(`${prefix}email-credits`)}\n\n www.chatiZZe.com`,
        html: emailTemplate(verificationLink, verifyEmailDto.mailType)
      };

      this.transporter.sendMail(mailOptions, (e, info) => {
        if (e) {
          console.log(e);
        } else {
          console.log(`Verification email sent to ${verifyEmailDto.email}: ${info.response}`);
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
