import { randomUUID } from 'node:crypto'
import { Module } from '@nestjs/common'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

export const CORRELATION_ID_HEADER = 'x-correlation-id'

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        return {
          pinoHttp: {
            level: env.get('LOG_LEVEL'),
            formatters: {
              level: (label) => ({ level: label }),
            },
            genReqId: (req, res) => {
              const incoming = req.headers[CORRELATION_ID_HEADER]
              const correlationId = Array.isArray(incoming)
                ? incoming[0]
                : (incoming ?? randomUUID())

              res.setHeader(CORRELATION_ID_HEADER, correlationId)
              return correlationId
            },
            customProps: (req) => ({
              correlationId: req.id,
            }),
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'req.body.password',
                'req.body.token',
                'res.headers["set-cookie"]',
              ],
              censor: '***',
            },
            serializers: {
              req: (req) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
            },
          },
        }
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
