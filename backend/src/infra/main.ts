import './observability/tracing'

import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { getUploadsDirectory } from './storage/uploads-directory'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })

  app.use(helmet())
  app.useLogger(app.get(Logger))

  const configService = app.get(EnvService)
  const corsOrigin = configService.get('CORS_ORIGIN')

  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : true,
    credentials: true,
  })

  app.useStaticAssets(getUploadsDirectory(), { prefix: '/uploads/' })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bil API')
    .setDescription('Documentação dos endpoints HTTP expostos pela API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
