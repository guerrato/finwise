import 'reflect-metadata'
import { container } from 'tsyringe'
import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { AuthController } from 'controllers/auth.controller'
import { AuthLogin } from 'schemas/auth.schema'

export const authRoutes: FastifyPluginCallback = (fastify, _, done) => {
  const authController = container.resolve(AuthController)
  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          '2xx': {
            properties: {
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    (request: FastifyRequest<{ Body: AuthLogin }>, reply) => authController.login(request, reply)
  )

  done()
}
