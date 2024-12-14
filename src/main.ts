import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { CustomHeadersEnum, LoggerService } from "@ssmovzh/chatterly-common-utils";
import { AppModule } from "./app.module";

(async () => {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggerService); // Use resolve() for transient scoped providers
  const configService = app.get(ConfigService);

  app.useLogger(logger);

  const clientUrl = configService.get<string>("app.clientUrl");
  app.enableCors({
    origin: [clientUrl],
    credentials: true,
    exposedHeaders: Object.values(CustomHeadersEnum),
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
  });

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  const port = configService.get<number>("app.port");
  await app.listen(port);

  logger.log(`Service started and listening on port ${port}`);
})();
