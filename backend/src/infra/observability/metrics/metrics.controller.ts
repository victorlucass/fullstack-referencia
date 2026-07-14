import { Controller, Get, Res } from '@nestjs/common'
import { PrometheusController } from '@willsoto/nestjs-prometheus'
import type { Response } from 'express'
import { Public } from '@/infra/auth/public'

@Public()
@Controller()
export class MetricsController extends PrometheusController {
  @Get()
  index(@Res({ passthrough: true }) response: Response) {
    return super.index(response)
  }
}
