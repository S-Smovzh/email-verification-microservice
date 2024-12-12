import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EmailModule } from "~/modules/email/email.module";
import { RabbitModule } from "~/modules/rabbit";
import { HealthCheckModule } from "~/modules/health-check/health-check.module";
import { defaultImports, LoggerModule } from "~/modules/common";

@Module({
  imports: [...defaultImports, ConfigModule.forRoot(), EmailModule, RabbitModule, HealthCheckModule, LoggerModule]
})
export class AppModule {}
