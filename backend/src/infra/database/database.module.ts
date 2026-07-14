import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/user/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { CacheModule } from '../cache/cache.module'
import { AuditLogRepository } from '@/core/audit/audit-log-repository'
import { PrismaAuditLogRepository } from './prisma/repositories/prisma-audit-log-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: AuditLogRepository,
      useClass: PrismaAuditLogRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, AuditLogRepository],
})
export class DatabaseModule {}
