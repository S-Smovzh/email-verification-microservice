import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EmailModule } from "~/modules/email/email.module";
import { EmailController } from "~/modules/email/email.controller";


@Module({
  imports: [ConfigModule.forRoot(), EmailModule],
  controllers: [EmailController]
})
export class AppModule {}
