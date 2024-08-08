import { autoInjectable, inject } from 'tsyringe'
import httpResponse from '../lib/responses'
import { IAccountService } from 'services'
import { CreateAccountInput } from 'dtos/account.dto'
import { isEmpty } from 'utils/string'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface IAccountController {
  create(request: FastifyRequest<{ Body: CreateAccountInput }>, reply: FastifyReply): Promise<void>
}

@autoInjectable()
export class AccountController implements IAccountController {
  constructor(@inject('IAccountService') private readonly accountService: IAccountService) {}

  async create(req: FastifyRequest<{ Body: CreateAccountInput }>, reply: FastifyReply): Promise<void> {
    try {
      if (isEmpty(req.user.id)) {
        return reply.code(401).send(httpResponse({ error: 'Unauthorized' }))
      }

      const data = await this.accountService.create(req.body, req.user.id)

      return reply.code(200).send(httpResponse({ data }))
    } catch (error) {
      console.log(error)
      return reply.status(500).send(httpResponse({ error: 'Unknown error' }))
    }
  }
}
