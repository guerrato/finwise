import { autoInjectable, inject } from 'tsyringe'
import { Prisma, User } from '@prisma/client'
import { DbProvider } from 'providers/db.provider'
import { generateHash } from 'utils/security'
import { isEmpty } from 'utils/string'

export interface IUserRepository {
  getByEmail(email: string): Promise<User | null>
  getById(id: string): Promise<User | null>
  create(user: Prisma.UserCreateInput): Promise<User>
}

@autoInjectable()
export class UserRepository implements IUserRepository {
  constructor(@inject('DbProvider') private readonly dbContext: DbProvider) {}

  async create(user: Prisma.UserCreateInput): Promise<User> {
    if (isEmpty(process.env.SECRET_KEY)) {
      throw new Error('RPS_VAR_MISSING: Internal Error: Variables missing')
    }

    user.password = await generateHash(user.password, process.env.SECRET_KEY)

    return await this.dbContext.prisma.user.create({
      data: user,
    })
  }

  async getById(id: string): Promise<User | null> {
    return await this.dbContext.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.dbContext.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }
}
