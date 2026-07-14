import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { getUploadsDirectory } from './storage/uploads-directory'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
  })

  app.use(helmet())

  const configService = app.get(EnvService)
  const corsOrigin = configService.get('CORS_ORIGIN')

  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : true,
    credentials: true,
  })

  app.useStaticAssets(getUploadsDirectory(), { prefix: '/uploads/' })

  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
