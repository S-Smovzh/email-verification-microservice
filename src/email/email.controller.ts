import { MessagePattern, Payload, Transport } from "@nestjs/microservices";
import { Controller, UseFilters } from "@nestjs/common";
import { ExceptionFilter } from "../exceptions/Exception.filter";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { EmailService } from "./email.service";

@UseFilters(new ExceptionFilter())
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: "verify" }, Transport.REDIS)
  async validateEmail(@Payload() verifyEmailDto: VerifyEmailDto) {
    return await this.emailService.validateEmail(verifyEmailDto);
  }
  
  @MessagePattern({ cmd: "reset-password" }, Transport.REDIS)
  async refreshPasswordEmail(@Payload() verifyEmailDto: VerifyEmailDto) {
    return await this.emailService.validateEmail(verifyEmailDto);
  }
}
