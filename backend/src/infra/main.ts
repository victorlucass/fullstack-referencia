import './observability/tracing'

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { getUploadsDirectory } from './storage/uploads-directory'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
  })

  app.useStaticAssets(getUploadsDirectory(), { prefix: '/uploads/' })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
