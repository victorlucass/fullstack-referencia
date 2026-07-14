import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import {
  AuditLogRecord,
  AuditLogRepository,
  CreateAuditLogParams,
} from '@/core/audit/audit-log-repository'

const PAGE_SIZE = 20

@Injectable()
export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: CreateAuditLogParams): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: (params.before as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        after: (params.after as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  }

  async findMany({ page }: { page: number }): Promise<AuditLogRecord[]> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })

    return logs.map((log) => ({
      id: log.id,
      actorId: log.actorId,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      before: log.before as Record<string, unknown> | null,
      after: log.after as Record<string, unknown> | null,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    }))
  }
}
