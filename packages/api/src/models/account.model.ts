import { Prisma, Account as PrismaAccount } from '@prisma/client'
import { SchemaModel } from './schema.model'

export type CreateAccountInput = Pick<Prisma.AccountCreateInput, 'name' | 'currency'> & { ownerId: string }

export type Account = PrismaAccount

export const AccountSchema: SchemaModel<Account> = {
  required: ['id', 'name', 'currency', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    currency: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}
