export interface CreateAuditLogParams {
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
}

export interface AuditLogRecord {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export abstract class AuditLogRepository {
  abstract create(params: CreateAuditLogParams): Promise<void>
  abstract findMany(params: { page: number }): Promise<AuditLogRecord[]>
}
