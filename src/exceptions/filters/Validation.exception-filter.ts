import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from '../Validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(200).json({
      errors: exception.response,
      timestamp: new Date().toUTCString(),
      path: request.url
    });
  }
}

// @Injectable()
// export class NotFoundInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     // next.handle() is an Observable of the controller's result value
//     return next.handle()
//       .pipe(catchError(error => {
//         if (error instanceof EntityNotFoundError) {
//           throw new NotFoundException(error.message);
//         } else {
//           throw error;
//         }
//       }));
//   }
// }
