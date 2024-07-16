import { autoInjectable, inject } from 'tsyringe'
import { Bank } from '@prisma/client'
import { DbProvider } from 'providers/db.provider'
import { CreateBankInput, UpdateBankInput } from 'dtos/bank.dto'

export interface IBankRepository {
  create(bank: CreateBankInput): Promise<Bank>
  update(bank: UpdateBankInput): Promise<Bank>
  delete(bankId: string): Promise<void>
  listByAccount(accountId: string): Promise<Bank[]>
}

@autoInjectable()
export class BankRepository implements IBankRepository {
  constructor(@inject('DbProvider') private readonly dbContext: DbProvider) {}

  async create(bank: CreateBankInput): Promise<Bank> {
    return await this.dbContext.prisma.bank.create({
      data: bank,
    })
  }

  async update(bank: UpdateBankInput): Promise<Bank> {
    return await this.dbContext.prisma.bank.update({
      where: { id: bank.id },
      data: bank,
    })
  }

  async delete(bankId: string): Promise<void> {
    await this.dbContext.prisma.bank.delete({
      where: { id: bankId },
    })
  }

  async listByAccount(accountId: string): Promise<Bank[]> {
    return await this.dbContext.prisma.bank.findMany({
      where: { accountId },
    })
  }
}
