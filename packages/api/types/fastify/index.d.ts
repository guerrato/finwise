import { FastifyRequest, fastify } from 'fastify'

// declare module 'fastify' {
//   interface FastifyRequest {
//     user: {
//       id: string
//       role?: string
//     }
//   }
// }

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      role?: string
    }
  }
}
