import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

type FetchUsersUseCaseResponse = Either<never, { users: User[] }>

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.findMany()

    return right({ users })
  }
}
