import { autoInjectable, inject } from 'tsyringe'
import { DbProvider } from 'providers/db.provider'
import { CreateInflowInput, UpdateInflowInput } from 'dtos/inflow.dto'
import { Inflow } from '@prisma/client'

export interface IInflowRepository {
  create(inflow: CreateInflowInput): Promise<Inflow>
  list(accountId: string): Promise<Inflow[]>
  getById(id: string): Promise<Inflow | null>
  delete(id: string): Promise<Inflow>
  update(data: UpdateInflowInput): Promise<Inflow>
}

@autoInjectable()
export class InflowRepository implements IInflowRepository {
  constructor(@inject('DbProvider') private readonly dbContext: DbProvider) {}

  async create(inflow: CreateInflowInput): Promise<Inflow> {
    return await this.dbContext.prisma.inflow.create({
      data: inflow,
    })
  }

  async list(accountId: string): Promise<Inflow[]> {
    return await this.dbContext.prisma.inflow.findMany({ where: { accountId: accountId } })
  }

  async getById(id: string): Promise<Inflow | null> {
    return await this.dbContext.prisma.inflow.findUnique({ where: { id } })
  }

  async delete(id: string): Promise<Inflow> {
    return await this.dbContext.prisma.inflow.delete({ where: { id } })
  }

  async update(data: UpdateInflowInput): Promise<Inflow> {
    return await this.dbContext.prisma.inflow.update({ where: { id: data.id }, data })
  }
}
