import { autoInjectable, inject } from 'tsyringe'
import { assign } from 'models/schema.model'
import { Account, AccountSchema, CreateAccountInput } from 'models/account.model'
import { IAccountRepository } from 'repositories/account.repository'
import { IUserRepository } from 'repositories/user.repository'
import { isEmpty } from 'utils/string'

export interface IAccountService {
  create(account: CreateAccountInput): Promise<Account>
}

@autoInjectable()
export class AccountService implements IAccountService {
  constructor(
    @inject('IAccountRepository') private readonly accountRepository: IAccountRepository,
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async create(account: CreateAccountInput): Promise<Account> {
    try {
      const { ownerId, ...data } = account

      const user = await this.userRepository.getUserById(ownerId)

      if (isEmpty(user)) {
        throw new Error('User not found')
      }

      const createdAccount = await this.accountRepository.create(data, user.id)
      return assign<Account, typeof createdAccount>(createdAccount, AccountSchema)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }
}
