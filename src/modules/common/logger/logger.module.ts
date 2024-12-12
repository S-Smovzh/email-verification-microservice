import { Global, Module, Scope } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerService } from "./logger";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LoggerService,
      scope: Scope.TRANSIENT,
      useFactory: () => new LoggerService()
    }
  ],
  exports: [LoggerService]
})
export class LoggerModule {}
