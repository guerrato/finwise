import { autoInjectable, inject } from 'tsyringe'
import { IAccountRepository } from 'repositories/account.repository'
import { IUserRepository } from 'repositories/user.repository'
import { isEmpty } from 'utils/string'
import { map } from 'utils/dto'
import { Account, CreateAccountInput } from 'dtos/account.dto'

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
      const { ownerId } = account

      const user = await this.userRepository.getUserById(ownerId)

      if (isEmpty(user)) {
        throw new Error('User not found')
      }

      const createdAccount = await this.accountRepository.create(account)
      return map(createdAccount, Account)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }
}
