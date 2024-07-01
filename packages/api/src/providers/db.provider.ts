import { PrismaClient } from '@prisma/client'
import { singleton } from 'tsyringe'

@singleton()
export class DbProvider extends PrismaClient {
  private readonly _prisma: PrismaClient
  constructor() {
    super()
    this._prisma = new PrismaClient()
  }
  get prisma(){
    return this._prisma
  }
}
