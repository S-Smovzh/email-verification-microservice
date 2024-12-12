import { Injectable } from "@nestjs/common";
import { EmailService } from "~/modules/email/email.service";
import { EmailTypeEnum } from "~/modules/common";

@Injectable()
export class Handlers {
  private handlers = new Map();

  constructor(private readonly emailService: EmailService) {
    this.handlers.set(EmailTypeEnum.VERIFY_EMAIL, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(EmailTypeEnum.RESET_PASSWORD, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(EmailTypeEnum.VERIFY_EMAIL_CHANGE, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(EmailTypeEnum.VERIFY_TEL_CHANGE, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(EmailTypeEnum.VERIFY_PASSWORD_CHANGE, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(EmailTypeEnum.VERIFY_USERNAME_CHANGE, this.emailService.validateEmail.bind(this.emailService));
  }

  get(action: EmailTypeEnum): () => any {
    const handlerFunction = this.handlers.get(action);

    if (!handlerFunction) {
      throw new Error("Unknown email type.");
    }

    return handlerFunction;
  }
}
