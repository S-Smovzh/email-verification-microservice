import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { InternalException } from '../Internal.exception';

@Catch(InternalException)
export class InternalExceptionFilter implements ExceptionFilter {
  catch(exception: InternalException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception.error);

    response.status(200).json({
      statusCode: exception.response.code,
      message: exception.response.message,
      timestamp: new Date().toUTCString(),
      path: request.url
    });
  }
}
