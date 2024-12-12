import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "~/modules/common";
import { AppModule } from "./app.module";

(async () => {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggerService); // Use resolve() for transient scoped providers
  const configService = app.get(ConfigService);

  app.useLogger(logger);

  app.enableCors({
    origin: [process.env.FRONT_URL],
    credentials: true,
    exposedHeaders: ["X-Access-Token", "X-Refresh-Token", "X-Client-Token", "X-Country", "Content-Type"],
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
