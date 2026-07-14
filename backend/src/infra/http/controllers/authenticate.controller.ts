import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/user/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/user/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('sessions')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
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
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
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
