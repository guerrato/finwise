import { autoInjectable, inject } from 'tsyringe'
import { Prisma, Account } from '@prisma/client'
import { DbProvider } from 'providers/db.provider'

type AccountUncheckedUpdateInput = Prisma.AccountUncheckedUpdateInput & { id: string }

export interface IAccountRepository {
  create(account: Prisma.AccountUncheckedCreateInput): Promise<Account>
  update(account: AccountUncheckedUpdateInput): Promise<Account>
  delete(accountId: string): Promise<void>
  listByUserId(userId: string): Promise<Account[]>
  getById(accountId: string): Promise<Account | null>
  getWithRoleById(accountId: string): Promise<Prisma.AccountGetPayload<{ include: { userAccountRoles: true } }> | null>
}

@autoInjectable()
export class AccountRepository implements IAccountRepository {
  constructor(@inject('DbProvider') private readonly dbContext: DbProvider) {}

  async create(account: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    return await this.dbContext.prisma.account.create({
      data: {
        ...account,
        userAccountRoles: {
          create: {
            role: 'OWNER',
            user: {
              connect: {
                id: account.createdById,
              },
            },
          },
        },
      },
    })
  }

  async update(account: AccountUncheckedUpdateInput): Promise<Account> {
    return await this.dbContext.prisma.account.update({
      where: { id: account.id },
      data: account,
    })
  }

  async delete(accountId: string): Promise<void> {
    await this.dbContext.prisma.account.delete({
      where: { id: accountId },
    })
  }

  async listByUserId(userId: string): Promise<Account[]> {
    return await this.dbContext.prisma.account.findMany({
      where: { userAccountRoles: { some: { userId, role: { in: ['OWNER', 'MANAGER'] } } } },
    })
  }

  async getById(accountId: string): Promise<Account | null> {
    return await this.dbContext.prisma.account.findUnique({
      where: { id: accountId },
    })
  }

  async getWithRoleById(
    accountId: string
  ): Promise<Prisma.AccountGetPayload<{ include: { userAccountRoles: true } }> | null> {
    return await this.dbContext.prisma.account.findUnique({
      where: { id: accountId },
      include: { userAccountRoles: true },
    })
  }
}
