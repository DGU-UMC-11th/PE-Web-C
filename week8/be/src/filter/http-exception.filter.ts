import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exception/api.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const message =
      typeof body === 'string'
        ? body
        : (body as { message: string | string[] }).message;

    // ApiException은 직접 정한 code를 쓰고, 나머지는 6주차 규칙 그대로 씀
    const code =
      exception instanceof ApiException ? exception.code : 'COMMON' + status;

    response.status(status).json({
      isSuccess: false,
      code,
      message: Array.isArray(message) ? message[0] : message,
      result: null,
    });
  }
}
