import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import type { Request } from 'express'
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/user/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { AuditLogRepository } from '@/core/audit/audit-log-repository'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateUser: AuthenticateUserUseCase,
    private auditLogRepository: AuditLogRepository,
  ) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: 'Autentica um usuário e retorna um access token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticação bem-sucedida',
    schema: {
      type: 'object',
      properties: { access_token: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async handle(@Body() body: AuthenticateBodySchema, @Req() request: Request) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    await this.auditLogRepository.create({
      actorId: null,
      action: result.isLeft() ? 'user.login_failed' : 'user.login_succeeded',
      entityType: 'User',
      entityId: null,
      before: null,
      after: { email },
      ipAddress: request.ip ?? null,
      userAgent: request.headers['user-agent'] ?? null,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
