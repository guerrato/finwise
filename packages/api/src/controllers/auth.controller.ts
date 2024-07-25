import { autoInjectable, inject } from 'tsyringe'
import 'dotenv/config'
import httpResponse from '../lib/responses'
import BaseController, { IBaseController } from './base.controller'
import { IAuthService } from 'services/auth.service'
import { isEmpty } from 'utils/string'

import { AuthLogin } from 'schemas/auth.schema'
import { FastifyReply, FastifyRequest } from 'fastify'

export interface IAuthController extends IBaseController {
  login(request: FastifyRequest<{ Body: AuthLogin }>, reply: FastifyReply): Promise<void>
}

@autoInjectable()
export class AuthController extends BaseController implements IAuthController {
  constructor(@inject('IAuthService') private readonly authService: IAuthService) {
    super()
  }

  async login(req: FastifyRequest<{ Body: AuthLogin }>, reply: FastifyReply): Promise<void> {
    try {
      const { email, password } = req.body

      if (isEmpty(email) || isEmpty(password)) {
        return reply.code(400).send(httpResponse({ error: 'Email and password are required' }))
      }

      const result = await this.authService.login(email, password, req.ip)

      if (isEmpty(result?.token)) {
        return reply.code(401).send(httpResponse({ error: 'Unauthorized' }))
      }

      return reply.code(200).send(httpResponse({ data: result }))
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send(httpResponse({ error: error.message }))
      }
      return reply.status(500).send(httpResponse({ error: 'Unknown error' }))
    }
  }
}

// export default new AuthController()
