import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { RedisService } from '@/infra/cache/redis/redis.service'
import { Public } from '@/infra/auth/public'

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthIndicatorService: HealthIndicatorService,
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        const indicator = this.healthIndicatorService.check('database')
        try {
          await this.prisma.$queryRaw`SELECT 1`
          return indicator.up()
        } catch (error) {
          return indicator.down({
            message: error instanceof Error ? error.message : 'unknown error',
          })
        }
      },
      async () => {
        const indicator = this.healthIndicatorService.check('cache')
        try {
          await this.redis.ping()
          return indicator.up()
        } catch (error) {
          return indicator.down({
            message: error instanceof Error ? error.message : 'unknown error',
          })
        }
      },
    ])
  }
}
