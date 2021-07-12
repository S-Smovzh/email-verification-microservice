import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";

// const Backend = require("i18next-fs-backend");
//
// async function bootstrap() {
//   const directory = resolve(process.cwd(), "dist/locales");
//
//   await i18next.use(Backend).init(
//     {
//       // initImmediate: false,
//       // debug:true,
//       lng: "en",
//       fallbackLng: "en",
//       preload: readdirSync(directory).filter((fileName) => {
//         const joinedPath = join(directory, fileName);
//         return lstatSync(joinedPath).isDirectory();
//       }),
//       backend: {
//         loadPath: join(__dirname, "/locales/{{lng}}.json")
//       }
//     },
//     (e) => {
//       if (e) {
//         return console.error(e);
//       }
//     }
//   );
//
//   const app = await NestFactory.create(AppModule);
//   app.use(i18next);
//
//   await app.listen(process.env.PORT || 7000);
// }
//
// bootstrap();
//

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

bootstrap();
