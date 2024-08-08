import { autoInjectable, inject } from 'tsyringe'
import { IAccountRepository } from 'repositories/account.repository'
import { IUserRepository } from 'repositories/user.repository'
import { isEmpty } from 'utils/string'
import { map } from 'utils/dto'
import { Account, CreateAccountInput, UpdateAccountInput } from 'dtos/account.dto'
import { UserAccountRole, UserRole } from '@prisma/client'

export interface IAccountService {
  create(account: CreateAccountInput, userId: string): Promise<Account>
  update(account: UpdateAccountInput, userId: string): Promise<Account>
  delete(id: string): Promise<boolean>
  getById(id: string, userId: string): Promise<Account>
  listByUserId(userId: string): Promise<Account[]>
  hasPermission(userId: string, accountId: string): Promise<boolean>
}

@autoInjectable()
export class AccountService implements IAccountService {
  constructor(
    @inject('IAccountRepository') private readonly accountRepository: IAccountRepository,
    @inject('IUserRepository') private readonly userRepository: IUserRepository
  ) {}

  async create(account: CreateAccountInput, userId: string): Promise<Account> {
    try {
      const user = await this.userRepository.getById(userId)

      if (isEmpty(user)) {
        throw new Error('User not found')
      }

      const createdAccount = await this.accountRepository.create({ ...account, createdById: userId })

      return map(createdAccount, Account)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  async update(account: UpdateAccountInput, userId: string): Promise<Account> {
    try {
      const { id } = account

      const existingAccount = await this.accountRepository.getById(id)

      if (isEmpty(existingAccount)) {
        throw new Error('Account not found')
      }

      if (!this.hasPermission(userId, id)) {
        throw new Error('Unauthorized')
      }

      const updatedAccount = await this.accountRepository.update(account)
      return map(updatedAccount, Account)
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existingAccount = await this.accountRepository.getById(id)

      if (isEmpty(existingAccount)) {
        throw new Error('Account not found')
      }

      await this.accountRepository.delete(id)
      return true
    } catch (error) {
      throw new Error('Internal Error: Something went wrong. Please try again later.')
    }
  }

  async getById(id: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.getWithRoleById(id)

    if (isEmpty(account)) {
      throw new Error('Account not found')
    }

    if (!this.hasPermission(userId, id)) {
      throw new Error('Unauthorized')
    }

    return map(account, Account)
  }

  async listByUserId(userId: string): Promise<Account[]> {
    const accounts = await this.accountRepository.listByUserId(userId)

    return accounts.map((account) => map(account, Account))
  }

  async hasPermission(userId: string, accountId: string): Promise<boolean> {
    const account = await this.accountRepository.getWithRoleById(accountId)

    if (isEmpty(account)) {
      throw new Error('Account not found')
    }

    const managers = account.userAccountRoles.filter(
      (uar: UserAccountRole) => (uar.role === UserRole.MANAGER || uar.role === UserRole.OWNER) && uar.userId === userId
    )

    if (managers.length > 0) {
      return true
    }

    return false
  }
}
