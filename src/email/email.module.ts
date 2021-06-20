import { Module } from '@nestjs/common';
import { RedisModule } from '../config/redis.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [RedisModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
