import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { AuditLogRepository } from '@/core/audit/audit-log-repository'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/audit-logs')
export class FetchAuditLogsController {
  constructor(private auditLogRepository: AuditLogRepository) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: number) {
    const auditLogs = await this.auditLogRepository.findMany({ page })

    return { auditLogs }
  }
}
