import { Injectable } from "@nestjs/common";
import { LoggerService, AuthDataInterface } from "@ssmovzh/chatterly-common-utils";
import { Handlers } from "~/modules/email/handlers";

@Injectable()
export class Executor {
  constructor(
    private readonly handlers: Handlers,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(Executor.name);
  }

  async handleMessage(message: string): Promise<void> {
    let data: any;

    try {
      data = JSON.parse(message);
    } catch (error) {
      this.logger.error(`Error parsing message: ${error}.`, error.trace);
      return;
    }

    const handler = await this._getHandler(data);

    if (!handler) return;

    try {
      await handler(data);
      this.logger.verbose(`Message processed successfully.`);
      return;
    } catch (error) {
      this.logger.error(`Error: ${error}`, error.trace);
    }
  }

  protected async _getHandler(data: any & AuthDataInterface): Promise<(data: any) => any> {
    try {
      this.logger.log(`Start processing action: ${data.action}.`);
      const handler = this.handlers.get(data.action);

      if (!handler) {
        throw new Error(`Handler for action ${data.action} not found.`);
      }

      return handler;
    } catch (error) {
      this.logger.error(`Error: ${error}`, error.trace);
    }
  }
}
