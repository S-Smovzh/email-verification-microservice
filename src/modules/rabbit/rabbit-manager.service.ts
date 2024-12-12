import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Channel } from "amqplib";
import { ConfigService } from "@nestjs/config";
import { RabbitQueuesEnum } from "@ssmovzh/chatterly-common-utils";
import { LoggerService } from "~/modules/common";
import { RabbitConsumerService } from "~/modules/rabbit/rabbit-consumer.service";
import { Executor } from "~/modules/email/executor";

@Injectable()
export class RabbitConsumerManagerService implements OnModuleInit, OnModuleDestroy {
  private consumers: RabbitConsumerService[];

  constructor(
    @Inject("RABBITMQ_CHANNEL") private channel: Channel,
    private readonly executor: Executor,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const queueNames = [RabbitQueuesEnum.VERIFY_SIGN_UP, RabbitQueuesEnum.VERIFY_PASSWORD_RESET, RabbitQueuesEnum.VERIFY_ACCOUNT_UPDATE];

    this.consumers = queueNames.map((queueName) => {
      const loggerInstance = this.logger.clone();

      return new RabbitConsumerService(this.channel, this.executor, loggerInstance, this.configService, queueName);
    });

    await Promise.all(this.consumers.map((consumer) => consumer.onModuleInit()));
  }

  async onModuleDestroy() {
    await Promise.all(this.consumers.map((consumer) => consumer.onModuleDestroy()));
  }
}
