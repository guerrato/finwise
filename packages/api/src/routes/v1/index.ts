import { FastifyPluginCallback } from 'fastify'
import { authRoutes } from './auth.route'

export const v1Routes: FastifyPluginCallback = (fastify, _, done) => {
  fastify.register(authRoutes, { prefix: '/auth' })

  done()
}
