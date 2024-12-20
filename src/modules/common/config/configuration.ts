import * as process from "process";
import * as dotenv from "dotenv";
import { AppConfigInterface, RabbitConfigInterface } from "@ssmovzh/chatterly-common-utils";
import { MailConfigInterface } from "~/modules/common";

dotenv.config();

export default () => ({
  app: {
    port: +process.env.PORT,
    environment: process.env.ENVIRONMENT,
    clientUrl: process.env.CLIENT_URL
  } as AppConfigInterface,
  mailConfig: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    senderName: process.env.SENDER_NAME,
    senderEmail: process.env.SENDER_EMAIL
  } as MailConfigInterface,
  rabbitConfig: {
    protocol: "amqp",
    hostname: process.env.RABBIT_HOST,
    port: process.env.RABBIT_PORT ? +process.env.RABBIT_PORT : 5672,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD
  } as RabbitConfigInterface
});
