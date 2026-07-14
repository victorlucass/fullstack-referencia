import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Role } from './role'

export interface UserProps {
  name: string
  email: string
  password: string
  role: Role
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: Optional<UserProps, 'role'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        role: props.role ?? Role.OPERATOR,
      },
      id,
    )

    return user
  }
}
