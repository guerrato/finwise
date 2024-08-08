import { container } from 'tsyringe'
import { AccountController } from 'controllers'
import { Account, CreateAccountInput, GetAccountInput, UpdateAccountInput } from 'dtos/account.dto'
import { authMiddleware } from 'middleware/auth.middleware'
import { getSchema } from 'utils/fastify'
import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { Type } from '@sinclair/typebox'

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

  fastify.get(
    '/',
    {
      ...getSchema({ }, Type.Array(Account)),
      preHandler: (request, reply) => authMiddleware(request, reply),
    },
    (request: FastifyRequest<{ Body: UpdateAccountInput }>, reply: FastifyReply) => {
      accountController.list(request, reply)
    }
  )
  
  fastify.get(
    '/:id',
    {
      ...getSchema({ params: GetAccountInput}, Type.Array(Account)),
      preHandler: (request, reply) => authMiddleware(request, reply),
    },
    (request: FastifyRequest<{ Params: GetAccountInput }>, reply: FastifyReply) => {
      accountController.getById(request, reply)
    }
  )

  fastify.put(
    '/',
    {
      ...getSchema({ body: UpdateAccountInput }, Account),
      preHandler: (request, reply) => authMiddleware(request, reply),
    },
    (request: FastifyRequest<{ Body: UpdateAccountInput }>, reply: FastifyReply) => {
      accountController.update(request, reply)
    }
  )

  done()
}
