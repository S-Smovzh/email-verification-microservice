import { Module } from "@nestjs/common";
import { EmailService } from "~/modules/email/email.service";
import { Handlers } from "~/modules/email/handlers";
import { Executor } from "~/modules/email/executor";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [EmailService, Handlers, Executor],
  exports: [EmailService, Handlers, Executor]
})
export class EmailModule {}
