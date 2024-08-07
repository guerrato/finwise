import { autoInjectable, inject } from 'tsyringe'
import { formatEmail, formatPersonName, isCompleteName, isEmail, isEmpty } from 'utils/string'
import { IUserRepository } from 'repositories/user.repository'
import { EmailProvider } from 'providers/email.provider'
import { CreateUserInput, User } from 'dtos/user.dto'
import { map } from 'utils/dto'

export interface IUserService {
  create(user: CreateUserInput): Promise<User>
  getById(id: string): Promise<User | null>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
    @inject('IEmailProvider') private readonly emailProvider: EmailProvider
  ) {}

  async create(user: CreateUserInput): Promise<User> {
    try {
      let { name, email } = user

      if (!isEmail(email)) {
        throw new Error('Invalid email')
      }

      const existingUser = await this.userRepository.getByEmail(email)

      if (existingUser) {
        throw new Error('User already exists')
      }

      if (!isCompleteName(name)) {
        throw new Error('Invalid name. Please provide a complete name')
      }

      name = formatPersonName(name)
      email = formatEmail(email)

      const createdUser = await this.userRepository.create({ name, email, password: this.createPassword() })

      await this.emailProvider.sendVerification(createdUser)
      return map(createdUser, User)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userRepository.getById(id)

    if (isEmpty(user)) {
      return null
    }

    return map(user, User) as User
  }

  private createPassword(): string {
    return Math.random().toString(36).slice(-8)
  }
}
