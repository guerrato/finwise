import { container } from 'tsyringe'
import { AccountController } from 'controllers/account.controller'
import { Account, CreateAccountInput } from 'dtos/account.dto'
import { authMiddleware } from 'middleware/auth.middleware'
import { getSchema } from 'utils/fastify'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'

export const accountRoutes: FastifyPluginCallback = (fastify, _, done) => {
  const accountController = container.resolve(AccountController)

  fastify.post(
    '/',
    {
      ...getSchema({ body: CreateAccountInput }, Account),
      preHandler: (request, reply) => authMiddleware(request, reply),
    },
    (request: FastifyRequest<{ Body: CreateAccountInput }>, reply: FastifyReply) => {
      accountController.create(request, reply)
    }
  )

  done()
}
