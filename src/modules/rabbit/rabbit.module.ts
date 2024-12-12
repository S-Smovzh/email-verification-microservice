import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitConsumerService } from "./rabbit-consumer.service";

@Module({
  imports: [ConfigModule],
  providers: [RabbitConsumerService],
  exports: [RabbitConsumerService]
})
export class RabbitModule {}
