import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Channel, connect, Connection } from "amqplib";
import { ConfigService } from "@nestjs/config";
import { RabbitConfigInterface } from "@ssmovzh/chatterly-common-utils";

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private readonly RABBIT_CONFIG: RabbitConfigInterface;

  constructor(private readonly configService: ConfigService) {
    this.RABBIT_CONFIG = this.configService.get<RabbitConfigInterface>("rabbitConfig");
  }

  async onModuleInit() {
    await this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    if (!!this.connection) {
      return;
    }
    this.connection = await connect(this.RABBIT_CONFIG);
    console.log("RabbitMQ connection established.");

    this.connection.on("error", (err) => {
      console.error("RabbitMQ Connection Error:", err.message);
      this.connection = null; // Reset connection to trigger reinitialization
    });

    this.connection.on("close", () => {
      console.warn("RabbitMQ Connection Closed. Attempting to reconnect...");
      this.connection = null;
    });
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log("RabbitMQ connection closed.");
    }
  }

  async createChannel(): Promise<Channel> {
    await this.initializeConnection(); // Ensure connection exists
    if (!this.connection) {
      throw new Error("RabbitMQ connection is not established.");
    }
    return this.connection.createChannel();
  }
}
