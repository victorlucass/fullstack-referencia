import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserRegisteredEvent } from '../events/user-registered-event'
import { Role } from './role'

export interface UserProps {
  name: string
  email: string
  password: string
  role: Role
}

export class User extends AggregateRoot<UserProps> {
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
    const isNewUser = !id

    const user = new User(
      {
        ...props,
        role: props.role ?? Role.OPERATOR,
      },
      id,
    )

    if (isNewUser) {
      user.addDomainEvent(new UserRegisteredEvent(user))
    }

    return user
  }
}
