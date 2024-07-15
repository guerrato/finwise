import { autoInjectable, inject } from 'tsyringe'
import { Prisma, Account } from '@prisma/client'
import { DbProvider } from 'providers/db.provider'

export interface IAccountRepository {
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
}

@autoInjectable()
export class AccountRepository implements IAccountRepository {
  constructor(@inject('DbProvider') private readonly dbContext: DbProvider) {}

  async create(account: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    account.UserAccountRole = {
      create: {
        role: 'OWNER',
        user: {
          connect: {
            id: account.ownerId,
          },
        },
      },
    }

    return await this.dbContext.prisma.account.create({
      data: account,
    })
  }
}
