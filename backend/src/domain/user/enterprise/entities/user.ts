import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRegisteredEvent } from '../events/user-registered-event'

export interface UserProps {
  name: string
  email: string
  password: string
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

  static create(props: UserProps, id?: UniqueEntityID) {
    const isNewUser = !id

    const user = new User(props, id)

    if (isNewUser) {
      user.addDomainEvent(new UserRegisteredEvent(user))
    }

    return user
  }
}
