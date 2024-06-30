import { autoInjectable, inject } from 'tsyringe'
import { CreateUserInput, User, UserSchema } from 'models/user.model'
import { formatEmail, formatPersonName, isCompleteName, isEmail } from 'utils/string'
import { IUserRepository } from 'repositories/user.repository'
import { assign } from 'models/schema.model'

export interface IUserService {
  create(user: CreateUserInput): Promise<User>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async create(user: CreateUserInput): Promise<User> {
    try {
      let { name, email } = user

      if (!isEmail(email)) {
        throw new Error('Invalid email')
      }

      if (!isCompleteName(name)) {
        throw new Error('Invalid name. Please provide a complete name')
      }

      name = formatPersonName(name)
      email = formatEmail(email)

      const createdUser = await this.userRepository.create({ name, email, password: this.createPassword() })

      return assign<User, typeof createdUser>(createdUser, UserSchema)

    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  private createPassword(): string {
    return Math.random().toString(36).slice(-8)
  }
}
