import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Channel, connect, ConsumeMessage, Message } from "amqplib";
import { from, Subject, Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { LoggerService } from "~/modules/common";
import { RabbitConfigInterface, RabbitQueuesEnum } from "@ssmovzh/chatterly-common-utils";
import { Executor } from "~/modules/rabbit/executor";

@Injectable()
export class RabbitConsumerService implements OnModuleInit, OnModuleDestroy {
  protected subscription: Subscription;
  private readonly rabbitConfig: RabbitConfigInterface;
  private readonly messageQueue = new Subject<Message>();
  private readonly concurrency = 10;
  private readonly verifyQueue: string = RabbitQueuesEnum.VERIFY_SIGN_UP;
  private readonly resetPasswordQueue: string = RabbitQueuesEnum.RESET_PASSWORD;

  constructor(
    @Inject("RABBITMQ_CHANNEL") private channel: Channel,
    private readonly jobExecutor: Executor,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    this.logger.setContext(RabbitConsumerService.name);
    this.rabbitConfig = configService.get<RabbitConfigInterface>("rabbitConfig");

    this.channel.on("error", async (err) => {
      this.logger.error(`RabbitMQ Channel Error: ${err.message}.`, err.stack);
    });
    this.channel.on("close", async () => {
      this.logger.warn("RabbitMQ Channel Closed. Attempting to recreate...");
      await this._recreateChannel();
    });
    this.channel.on("return", (msg) => {
      this.logger.warn(`Message returned from RabbitMQ: ${msg.content.toString()}.`);
    });
    this.channel.on("drain", () => {
      this.logger.debug("RabbitMQ Channel drained.");
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this._initializeQueueAndConsume();
    } catch (error) {
      this.logger.error(`Failed to initialize queue ${this.queueName}: ${error.message}`);
    }
  }

  onModuleDestroy(): void {
    // Gracefully close Subject
    this.messageQueue.complete();
    // Clean up RxJS pipeline
    this.subscription?.unsubscribe();
    this.logger.verbose(`RabbitMQ consumer completed and unsubscribed from ${this.queueName}, RxJS subscription closed.`);
  }

  protected async _initializeQueueAndConsume(): Promise<void> {
    try {
      await this.channel.assertQueue(this.queueName, {
        durable: true
      });
      this.logger.verbose(`Queue ${this.queueName} successfully asserted.`);
      this._processMessages();
      await this._consumeMessages();
    } catch (error) {
      this.logger.error(`Failed to assert or consume queue ${this.queueName}: ${error.message}`);
    }
  }

  protected _processMessages(): void {
    this.subscription = this.messageQueue.pipe(mergeMap((msg) => from(this._handleMessage(msg)), this.concurrency)).subscribe({
      next: () => {
        this.logger.verbose("Message processed successfully.");
      },
      error: (err) => {
        this.logger.error(`Error during message processing: ${err.message}.`);
      },
      complete: () => {
        this.logger.verbose("Message processing completed.");
      }
    });
  }

  protected async _consumeMessages(): Promise<void> {
    try {
      await this.channel.consume(this.queueName, (msg: ConsumeMessage | null) => {
        if (!!msg) {
          this.logger.debug(`Message received from queue ${this.queueName}: ${msg.content.toString()}.`);
          this.messageQueue.next(msg);
        } else {
          this.logger.warn(`Consumer canceled for queue ${this.queueName}, reinitializing...`);
          // Retry consumption
          this._consumeMessages();
        }
      });
    } catch (error) {
      this.logger.error(`Error consuming messages: ${error.message}.`);
    }
  }

  protected async _handleMessage(msg: Message): Promise<void> {
    try {
      const messageContent = msg.content.toString();

      await this._processMessageLogic(messageContent);

      this.logger.verbose(`Message acknowledged: ${messageContent}.`);
      this.channel.ack(msg);
    } catch (error) {
      this.logger.error(`Error processing message from ${this.queueName}: ${error.message}.`, error.stack);
      // Requeue is false to avoid endless loops
      this.channel.nack(msg, false, false);
    }
  }

  protected async _processMessageLogic(messageContent: string): Promise<void> {
    this.logger.debug(`_processMessageLogic: queue -> ${this.queueName}, Message -> ${messageContent}.`);

    await this.jobExecutor.handleMessage(messageContent);
  }

  protected async _recreateChannel(): Promise<void> {
    try {
      const connection = await connect(this.rabbitConfig);
      this.channel = await connection.createChannel();
      await this._initializeQueueAndConsume();
      this.logger.debug("RabbitMQ Channel successfully recreated.");
    } catch (err) {
      this.logger.error(`Failed to recreate RabbitMQ channel: ${err.message}`, err.stack);
    }
  }
}
