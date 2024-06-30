import { Prisma, User as PrismaUser } from '@prisma/client'
import { SchemaModel } from './schema.model'

export type CreateUserInput = Pick<Prisma.UserCreateInput, 'email' | 'name'>

export type User = Omit<PrismaUser, 'password'>

export const UserSchema: SchemaModel<User> = {
  required: ['id', 'name', 'email', 'verified', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    verified: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}
