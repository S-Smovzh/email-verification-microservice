import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { LoggerService, RabbitConfigInterface } from "@ssmovzh/chatterly-common-utils";
import { ConfigService } from "@nestjs/config";
import { Channel, connect, Connection, ConsumeMessage, Message } from "amqplib";
import { from, Subject, Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Executor } from "~/modules/email/executor";

@Injectable()
export class RabbitConsumerService implements OnModuleInit, OnModuleDestroy {
  protected subscription: Subscription;
  private readonly rabbitConfig: RabbitConfigInterface;
  private readonly messageQueue = new Subject<Message>();
  private readonly concurrency = 100;
  private readonly queueName: string;
  private connection: Connection | null = null;

  constructor(
    @Inject("RABBITMQ_CHANNEL") private channel: Channel,
    private readonly executor: Executor,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    @Inject("RABBITMQ_QUEUE_NAME") queueName: string
  ) {
    this.queueName = queueName;
    this.logger.setContext(RabbitConsumerService.name);
    this.rabbitConfig = configService.get<RabbitConfigInterface>("rabbitConfig");

    this._attachChannelListeners();
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
    this._detachChannelListeners();
    this.messageQueue.complete();
    // Clean up RxJS pipeline
    this.subscription?.unsubscribe();

    if (this.channel) {
      this.channel.close().catch((err) => this.logger.error("Failed to close channel:", err.message));
    }

    if (this.connection) {
      this.connection.close().catch((err) => this.logger.error("Failed to close connection:", err.message));
    }

    this.logger.verbose(`RabbitMQ consumer completed and unsubscribed from ${this.queueName}, RxJS subscription closed.`);
  }

  protected _attachChannelListeners(): void {
    this.channel.on("error", this._onChannelError);
    this.channel.on("close", this._onChannelClose);
    this.channel.on("return", this._onChannelReturn);
    this.channel.on("drain", this._onChannelDrain);
  }

  protected _detachChannelListeners(): void {
    this.channel.removeListener("error", this._onChannelError);
    this.channel.removeListener("close", this._onChannelClose);
    this.channel.removeListener("return", this._onChannelReturn);
    this.channel.removeListener("drain", this._onChannelDrain);
  }

  private _onChannelError = (err: Error): void => {
    this.logger.error(`RabbitMQ Channel Error: ${err.message}`, err.stack);
  };

  private _onChannelClose = async (): Promise<void> => {
    this.logger.warn("RabbitMQ Channel Closed. Attempting to recreate...");
    await this._recreateChannel();
  };

  private _onChannelReturn = (msg: Message): void => {
    this.logger.warn(`Message returned from RabbitMQ: ${msg.content.toString()}.`);
  };

  private _onChannelDrain = (): void => {
    this.logger.debug("RabbitMQ Channel drained.");
  };

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

      const result = await this._processMessageLogic(messageContent);

      if (msg.properties.replyTo) {
        this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
          correlationId: msg.properties.correlationId
        });
      }

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

    return await this.executor.handleMessage(messageContent);
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
