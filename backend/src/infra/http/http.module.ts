import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { FetchAuditLogsController } from './controllers/fetch-audit-logs.controller'
import { DatabaseModule } from '../database/database.module'
import { RegisterUserUseCase } from '@/domain/user/application/use-cases/register-user'
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user'
import { OnUserRegistered } from '@/domain/user/application/subscribers/on-user-registered'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    FetchAuditLogsController,
  ],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase, OnUserRegistered],
})
export class HttpModule {}
