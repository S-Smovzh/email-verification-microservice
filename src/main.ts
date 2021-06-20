import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import middleware from 'i18next-http-middleware';
import { lstatSync, readdirSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { join, resolve } from 'path';
import i18next from 'i18next';
import helmet from 'helmet';
import { AppModule } from './app.module';

require('dotenv').config({ path: '.env' });

const Backend = require('i18next-fs-backend');

async function bootstrap() {
  const directory = resolve(process.cwd(), 'dist/locales');

  i18next.use(Backend).init(
    {
      // initImmediate: false,
      // debug:true,
      lng: 'en',
      fallbackLng: 'en',
      preload: readdirSync(directory).filter((fileName) => {
        const joinedPath = join(directory, fileName);
        return lstatSync(joinedPath).isDirectory();
      }),
      backend: {
        loadPath: join(__dirname, '/locales/{{lng}}.json')
      }
    },
    (e) => {
      if (e) {
        return console.error(e);
      }
    }
  );

  const app = await NestFactory.create(AppModule);
  // app.use(i18next);
  app.use(helmet());
  app.enableCors({
    origin: [process.env.AUTHENTICATION_MICROSERVICE_URL, '*'],
    credentials: true,
    methods: ['POST']
  });

  const config = new DocumentBuilder()
    .setTitle('Email verification microservice')
    .setDescription(
      'Has only one route and one function which bootstraps email with a link containing unique verification code and sends it to the user.'
    )
    .setVersion('1.0')
    .addTag('email, verification, user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 7000);
}

bootstrap();
