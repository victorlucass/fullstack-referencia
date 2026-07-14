import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { Counter, Histogram } from 'prom-client'
import type { Request, Response } from 'express'
import { tap } from 'rxjs'

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private requestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private requestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() !== 'http') {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const route = request.route?.path ?? request.path
    const stopTimer = this.requestDuration.startTimer({
      method: request.method,
      route,
    })

    return next.handle().pipe(
      tap({
        next: () => this.recordResult(response, route, request, stopTimer),
        error: () => this.recordResult(response, route, request, stopTimer),
      }),
    )
  }

  private recordResult(
    response: Response,
    route: string,
    request: Request,
    stopTimer: (labels?: Record<string, string | number>) => number,
  ) {
    const statusCode = response.statusCode
    stopTimer({ status_code: statusCode })
    this.requestsTotal.inc({
      method: request.method,
      route,
      status_code: statusCode,
    })
  }
}
