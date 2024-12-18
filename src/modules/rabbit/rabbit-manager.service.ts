import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService, RabbitQueuesEnum } from "@ssmovzh/chatterly-common-utils";
import { RabbitConsumerService } from "~/modules/rabbit/rabbit-consumer.service";
import { Executor } from "~/modules/email/executor";
import { RabbitService } from "~/modules/rabbit/rabbit.service";

@Injectable()
export class RabbitConsumerManagerService implements OnModuleInit, OnModuleDestroy {
  private consumers: RabbitConsumerService[];

  constructor(
    private readonly executor: Executor,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly rabbitService: RabbitService
  ) {}

  async onModuleInit() {
    const queueNames = [RabbitQueuesEnum.VERIFY_EMAIL, RabbitQueuesEnum.VERIFY_PASSWORD_RESET, RabbitQueuesEnum.VERIFY_ACCOUNT_UPDATE];

    this.consumers = await Promise.all(
      queueNames.map(async (queueName) => {
        const loggerInstance = this.logger.clone();
        const channel = await this.rabbitService.createChannel();

        return new RabbitConsumerService(channel, this.executor, loggerInstance, this.configService, queueName);
      })
    );

    await Promise.all(this.consumers.map((consumer) => consumer.onModuleInit()));
  }

  async onModuleDestroy() {
    await Promise.all(this.consumers.map((consumer) => consumer.onModuleDestroy()));
  }
}
