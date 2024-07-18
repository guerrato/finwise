import { Type } from '@sinclair/typebox'
import { FastifyPluginCallback } from 'fastify'
import { AuthLogin } from 'schemas/auth.schema'
import { getSchema } from 'utils/fastify'

export const auth: FastifyPluginCallback = async (app, _, done) => {
  app.post('/login', getSchema({ body: AuthLogin }, Type.String()), (req, reply) => {
  })

  done()
}
