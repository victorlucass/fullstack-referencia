import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheModule } from '@/infra/cache/cache.module'

@Module({
  imports: [TerminusModule, DatabaseModule, CacheModule],
  controllers: [HealthController],
})
export class HealthModule {}
