import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: `redis://${process.env.REDIS_DB_NAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`,
      retryDelay: 3000,
      retryAttempts: 10
    }
  });

  app.listen(() => console.log("Microservice is listening"));
}

async function startWeb() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONT_URL],
    credentials: true,
    exposedHeaders: ["Access-Token", "Refresh-Token", "Client-Token", "Country", "Content-Type"],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"]
  });

  await app.listen(process.env.PORT || 3100);
}

startWeb();
bootstrap();
