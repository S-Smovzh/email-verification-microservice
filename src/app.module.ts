import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { EmailController } from './email/email.controller';
import { RedisModule } from './config/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 300,
      limit: 10
    }),
    RedisModule,
    EmailModule
  ],
  controllers: [EmailController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
