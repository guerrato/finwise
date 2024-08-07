import { FastifyPluginCallback } from 'fastify'
import { authMiddleware } from 'middleware/auth.middleware';

export const accountRoutes: FastifyPluginCallback = (fastify, _, done) => {
  fastify.route({
    method: "GET",
    url: "/healthcheck",
    preHandler: authMiddleware,
    handler: (req, rpl) => {
      rpl.send(req.user)
    }
  });

  done()
}
