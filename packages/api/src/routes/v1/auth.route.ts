import 'reflect-metadata'
import { container } from 'tsyringe'
import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { AuthController } from 'controllers/auth.controller'
import { AuthLogin } from 'schemas/auth.schema'
import { AuthLoginSuccess } from 'dtos/auth.dto'
import { getSchema } from 'utils/fastify'

export const authRoutes: FastifyPluginCallback = (fastify, _, done) => {
  const authController = container.resolve(AuthController)
  fastify.post(
    '/login',
    getSchema({ body: AuthLogin }, AuthLoginSuccess),
    (request: FastifyRequest<{ Body: AuthLogin }>, reply) => authController.login(request, reply)
  )

  done()
}
