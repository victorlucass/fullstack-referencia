import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

interface ErrorResponseBody {
  statusCode: number
  error: string
  message: string | string[]
  path: string
  timestamp: string
  correlationId?: string
}

const GENERIC_ERROR_MESSAGE =
  'Ocorreu um erro inesperado. Tente novamente em instantes ou contate o suporte informando o correlationId desta requisição.'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const correlationId = this.getCorrelationId(request)

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const body = this.buildKnownErrorBody(
        exception,
        status,
        request,
        correlationId,
      )

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(exception.message, exception.stack)
      }

      response.status(status).json(body)
      return
    }

    this.logger.error(
      exception instanceof Error ? exception.message : 'Unknown error',
      exception instanceof Error ? exception.stack : undefined,
    )

    const body: ErrorResponseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: GENERIC_ERROR_MESSAGE,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId,
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body)
  }

  private buildKnownErrorBody(
    exception: HttpException,
    status: number,
    request: Request,
    correlationId?: string,
  ): ErrorResponseBody {
    const exceptionResponse = exception.getResponse()

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (((exceptionResponse as Record<string, unknown>).message as
            string | string[]) ?? exception.message)

    return {
      statusCode: status,
      error: HttpStatus[status] ?? 'Error',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      correlationId,
    }
  }

  private getCorrelationId(request: Request): string | undefined {
    const requestWithId = request as Request & { id?: string }
    const header = request.headers['x-correlation-id']

    return requestWithId.id ?? (Array.isArray(header) ? header[0] : header)
  }
}
