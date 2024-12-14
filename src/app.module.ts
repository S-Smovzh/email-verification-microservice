import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EmailModule } from "~/modules/email/email.module";
import { RabbitModule } from "~/modules/rabbit";
import { defaultImports } from "~/modules/common";
import { HealthCheckModule, LoggerModule } from "@ssmovzh/chatterly-common-utils";

@Module({
  imports: [...defaultImports, ConfigModule.forRoot(), EmailModule, RabbitModule, HealthCheckModule, LoggerModule]
})
export class AppModule {}
