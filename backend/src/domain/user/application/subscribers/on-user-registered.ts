import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuditLogRepository } from '@/core/audit/audit-log-repository'
import { UserRegisteredEvent } from '../../enterprise/events/user-registered-event'

@Injectable()
export class OnUserRegistered implements EventHandler {
  constructor(private auditLogRepository: AuditLogRepository) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createAuditLog.bind(this),
      UserRegisteredEvent.name,
    )
  }

  private async createAuditLog({ user }: UserRegisteredEvent) {
    await this.auditLogRepository.create({
      actorId: user.id.toString(),
      action: 'user.registered',
      entityType: 'User',
      entityId: user.id.toString(),
      before: null,
      after: { name: user.name, email: user.email },
      ipAddress: null,
      userAgent: null,
    })
  }
}
