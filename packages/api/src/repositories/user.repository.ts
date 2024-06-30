import { autoInjectable, inject } from 'tsyringe'
import { Prisma, User } from '@prisma/client'
import { DbContext } from 'lib/dbContext'
import { generateHash } from 'utils/security'
import { isEmpty } from 'utils/string'

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User>
  getUserById(id: string): Promise<User>
  create(user: Prisma.UserCreateInput): Promise<User>
}

@autoInjectable()
export class UserRepository implements IUserRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}
  
  async create(user: Prisma.UserCreateInput): Promise<User> {
    if (isEmpty(process.env.SECRET_KEY)) {
      throw new Error('RPS_VAR_MISSING: Internal Error: Variables missing')
    }

    user.password = await generateHash(user.password, process.env.SECRET_KEY)

    return await this.dbContext.prisma.user.create({
      data: user,
    })
  }

  async getUserById(id: string): Promise<User> {
    return await this.dbContext.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    })
  }


  async getUserByEmail(email: string): Promise<User> {
    return await this.dbContext.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    })
  }
}
