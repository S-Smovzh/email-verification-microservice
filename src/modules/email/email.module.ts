import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./email.service";
import { Handlers } from "~/modules/email/handlers";
import { Executor } from "~/modules/email/executor";

@Module({
  imports: [ConfigModule],
  providers: [EmailService, Handlers, Executor],
  exports: [EmailService, Handlers, Executor]
})
export class EmailModule {}
