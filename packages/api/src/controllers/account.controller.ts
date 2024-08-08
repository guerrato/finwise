import { autoInjectable, inject } from 'tsyringe'
import httpResponse from '../lib/responses'
import { IAccountService } from 'services'
import { CreateAccountInput, GetAccountInput, UpdateAccountInput } from 'dtos/account.dto'
import { isEmpty } from 'utils/string'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface IAccountController {
  create(request: FastifyRequest<{ Body: CreateAccountInput }>, reply: FastifyReply): Promise<void>
  list(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(request: FastifyRequest, reply: FastifyReply): Promise<void>
  update(request: FastifyRequest<{ Body: UpdateAccountInput }>, reply: FastifyReply): Promise<void>
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

  async list(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const data = await this.accountService.listByUserId(req.user.id)

      return reply.code(200).send(httpResponse({ data }))
    } catch (error) {
      console.log(error)
      return reply.status(500).send(httpResponse({ error: 'Unknown error' }))
    }
  }

  async getById(req: FastifyRequest<{Params: GetAccountInput}>, reply: FastifyReply): Promise<void> {
    try {
      if (isEmpty(req.user.id)) {
        return reply.code(401).send(httpResponse({ error: 'Unauthorized' }))
      }

      const data = await this.accountService.getById(req.params.id, req.user.id)

      return reply.code(200).send(httpResponse({ data }))
    } catch (error) {
      console.log(error)
      return reply.status(500).send(httpResponse({ error: 'Unknown error' }))
    }
  }
  
  async update(req: FastifyRequest<{ Body: UpdateAccountInput }>, reply: FastifyReply): Promise<void> {
    try {
      if (isEmpty(req.user.id)) {
        return reply.code(401).send(httpResponse({ error: 'Unauthorized' }))
      }

      const data = await this.accountService.update(req.body, req.user.id)

      return reply.code(200).send(httpResponse({ data }))
    } catch (error) {
      console.log(error)
      return reply.status(500).send(httpResponse({ error: 'Unknown error' }))
    }
  }
}
