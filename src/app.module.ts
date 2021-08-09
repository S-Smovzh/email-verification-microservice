import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EmailController } from "./email/email.controller";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [ConfigModule.forRoot(), EmailModule],
  controllers: [EmailController]
})
export class AppModule {}
