import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private uniqueId: string;

  setUniqueId(uniqueId: string): void {
    this.uniqueId = uniqueId;
  }

  log(message: string): void {
    super.log(this._addUniqueIdToMessage(message));
  }

  error(message: any, trace?: string): void {
    message = typeof message === "string" ? message : JSON.stringify(message);
    super.error(this._addUniqueIdToMessage(message), trace);
  }

  warn(message: string): void {
    super.warn(this._addUniqueIdToMessage(message));
  }

  debug(message: string): void {
    super.debug(this._addUniqueIdToMessage(message));
  }

  verbose(message: string): void {
    super.verbose(this._addUniqueIdToMessage(message));
  }

  clone(): LoggerService {
    return new LoggerService();
  }

  private _addUniqueIdToMessage(message: string): string {
    return this.uniqueId ? `[Request ID: ${this.uniqueId}] ${message}` : message;
  }
}
