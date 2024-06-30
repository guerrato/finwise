import { autoInjectable, inject } from 'tsyringe'
import { Prisma, Account } from '@prisma/client'
import { DbContext } from 'lib/dbContext'

export interface IAccountRepository {
  create(account: Prisma.AccountCreateInput, ownerId: string): Promise<Account>
}

@autoInjectable()
export class AccountRepository implements IAccountRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}
  
  async create(account: Prisma.AccountCreateInput, ownerId: string): Promise<Account> {
    account.UserAccountRole = {
      create: {
        role: 'OWNER',
        user: {
          connect: {
            id: ownerId,
          },
        },
      },
    }
    return await this.dbContext.prisma.account.create({
      data: account,
    })
  }

}
