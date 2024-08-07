import { FastifyPluginCallback } from 'fastify'
import { authRoutes } from './auth.route'
import { accountRoutes } from './account.route'

export const v1Routes: FastifyPluginCallback = (fastify, _, done) => {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(accountRoutes, { prefix: '/account' })

  done()
}
