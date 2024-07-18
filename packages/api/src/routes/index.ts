import { FastifyInstance } from 'fastify'
import { auth } from './auth.route'
import { user } from './user.route'

export const registerRoutes = async (app: FastifyInstance, _:any, done: any) => {
  app.register(auth, { prefix: '/auth' })
  app.register(user, { prefix: '/user' })
}

