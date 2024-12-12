import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";
import { ApiResponseService } from "@ssmovzh/chatterly-common-utils/dist/services";
import { isObject } from "@ssmovzh/chatterly-common-utils/dist/functions";

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorData = exception.response ?? exception.message;
    let error = isObject(errorData) ? { ...errorData } : { message: errorData };

    if (error.data === undefined || error.response === undefined) {
      error = ApiResponseService.error(errorData, httpStatus);
    }
    if (isObject(error) && error.response) {
      error.response.timestamp = new Date().toISOString();
      error.response.path = this.httpAdapter.getRequestUrl(ctx.getRequest());
    }
    this.httpAdapter.reply(ctx.getResponse(), error, httpStatus);
  }
}
