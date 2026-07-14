import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@/domain/user/enterprise/entities/role'
import { UserPayload } from './jwt.strategy'
import { ROLES_KEY } from './roles'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user as UserPayload | undefined

    if (!user) {
      return false
    }

    return requiredRoles.includes(user.role)
  }
}
