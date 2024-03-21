import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";

enum MysqlErrorCode {
  ALREADY_EXIST = "ER_DUP_ENTRY",
}

@Catch()
export class MyDefaultExceptionLoggingFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception: unknown, host: ArgumentsHost): void {
    let args: unknown;
    let message: string = "UNKNOWN ERROR";

    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const req = context.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception);
    const datetime = new Date();

    message = exception instanceof HttpException ? exception.message : message;
    message = exception instanceof QueryFailedError ? "Already Exist" : message;

    const errorResponse = {
      code: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, args: { req, res } });
    } else {
      this.logger.error({ err: errorResponse, args });
    }

    res.status(statusCode).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    if (
      exception instanceof QueryFailedError &&
      exception.driverError.code === MysqlErrorCode.ALREADY_EXIST
    ) {
      return HttpStatus.CONFLICT;
    } else if (exception instanceof HttpException) return exception.getStatus();
    else return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
