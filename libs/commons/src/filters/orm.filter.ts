import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(QueryFailedError, TypeORMError, EntityNotFoundError)
export class TypeORMFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    if (exception instanceof QueryFailedError) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
        status: 'error',
      });
    } else if (exception instanceof EntityNotFoundError) {
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
        status: 'error',
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: exception.message,
        status: 'critical',
      });
    }
  }
}
