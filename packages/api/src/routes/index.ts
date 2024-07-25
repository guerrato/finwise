// import { Response, Router } from 'express'
// import httpResponse from '../lib/responses'
// import v1Routes from './v1/index'
import { FastifyPluginCallback } from 'fastify'
import { v1Routes } from './v1'

// const router = Router()

// router.get('/', (_, res: Response) => res.json(httpResponse({ message: 'OK' })))
// router.use('/auth', v1Routes)

// export default router

export const routes: FastifyPluginCallback = (fastify, _, done) => {
  fastify.register(v1Routes, { prefix: '/v1' })

  done()
}
