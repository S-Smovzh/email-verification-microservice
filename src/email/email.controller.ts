import { MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { Controller, UseFilters } from "@nestjs/common";
import { ExceptionFilter } from "../exceptions/Exception.filter";
import { VerifyDataDto } from "./dto/verify-data.dto";
import { EmailService } from "./email.service";

@UseFilters(new ExceptionFilter())
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: "invoke" }, Transport.REDIS)
  async invoke(): Promise<void> {
    console.log("email-ver-service invoked");
  }

  @MessagePattern({ cmd: "verify" }, Transport.REDIS)
  async validateEmail(@Payload() verifyEmailDto: VerifyDataDto) {
    return await this.emailService.validateEmail(verifyEmailDto);
  }

  @MessagePattern({ cmd: "reset-password" }, Transport.REDIS)
  async refreshPasswordEmail(@Payload() verifyEmailDto: VerifyDataDto) {
    return await this.emailService.validateEmail(verifyEmailDto);
  }
}
