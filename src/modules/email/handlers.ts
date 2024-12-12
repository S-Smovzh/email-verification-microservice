import { Injectable } from "@nestjs/common";
import { EmailService } from "~/modules/email/email.service";
import { RabbitQueuesEnum } from "@ssmovzh/chatterly-common-utils";

@Injectable()
export class Handlers {
  private handlers = new Map<RabbitQueuesEnum, any>();

  constructor(private readonly emailService: EmailService) {
    this.handlers.set(RabbitQueuesEnum.VERIFY_SIGN_UP, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(RabbitQueuesEnum.VERIFY_PASSWORD_RESET, this.emailService.validateEmail.bind(this.emailService));
    this.handlers.set(RabbitQueuesEnum.VERIFY_ACCOUNT_UPDATE, this.emailService.validateEmail.bind(this.emailService));
  }

  get(action: RabbitQueuesEnum): () => any {
    const handlerFunction = this.handlers.get(action);

    if (!handlerFunction) {
      throw new Error("Unknown email type.");
    }

    return handlerFunction;
  }
}
