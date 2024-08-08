import 'reflect-metadata'
import { FastifyPluginCallback } from 'fastify'
import { v1Routes } from './v1'

export const routes: FastifyPluginCallback = (fastify, _, done) => {
  fastify.register(v1Routes, { prefix: '/v1' })

  done()
}
