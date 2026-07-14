import { Controller, Get } from '@nestjs/common'
import { FetchUsersUseCase } from '@/domain/user/application/use-cases/fetch-users'
import { Role } from '@/domain/user/enterprise/entities/role'
import { Roles } from '@/infra/auth/roles'

@Controller('/accounts')
export class FetchUsersController {
  constructor(private fetchUsers: FetchUsersUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  async handle() {
    const result = await this.fetchUsers.execute()

    const { users } = result.value

    return {
      users: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    }
  }
}
