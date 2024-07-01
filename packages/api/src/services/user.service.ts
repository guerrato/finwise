import { autoInjectable, inject } from 'tsyringe'
import { CreateUserInput, User, UserSchema } from 'models/user.model'
import { formatEmail, formatPersonName, isCompleteName, isEmail } from 'utils/string'
import { IUserRepository } from 'repositories/user.repository'
import { assign } from 'models/schema.model'
import { EmailProvider } from 'providers/email.provider'

export interface IUserService {
  create(user: CreateUserInput): Promise<User>
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

      const existingUser = await this.userRepository.getUserByEmail(email)

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
      return assign<User, typeof createdUser>(createdUser, UserSchema)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  private createPassword(): string {
    return Math.random().toString(36).slice(-8)
  }
}
