import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { EmailModule } from "~/modules/email/email.module";
import { RabbitModule } from "~/modules/rabbit";
import { defaultImports } from "~/modules/common";
import { HealthCheckModule, LoggerModule } from "@ssmovzh/chatterly-common-utils";
import { I18nJsonLoader, I18nModule } from "nestjs-i18n";
import { join } from "node:path";

@Module({
  imports: [
    ...defaultImports,
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: join(__dirname, "/i18n/"),
        watch: true
      },
      loader: I18nJsonLoader
    }),
    ConfigModule.forRoot(),
    EmailModule,
    RabbitModule,
    HealthCheckModule,
    LoggerModule
  ]
})
export class AppModule {}
