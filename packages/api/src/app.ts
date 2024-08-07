import Fastify, { FastifyInstance } from 'fastify'
import { routes } from 'routes'
import { setup } from 'startup'
import { isEmpty } from 'utils/string'

export const buildServer = async (): Promise<FastifyInstance> => {
  setup()

  const useLogger: boolean = ['local', 'development'].includes(process.env.NODE_ENV ?? '') ? true : false
  const fastify: FastifyInstance = Fastify({
    logger: useLogger,
  })
  try {
    fastify.decorateRequest('user', null)
    fastify.register(routes)

    return fastify
  } catch (err) {
    throw err
  }
}

export const init = async () => {
  let fastify: FastifyInstance
  try {
    fastify = await buildServer()
    await fastify.listen({
      port: (process.env.PORT as number | undefined) || 3000,
      host: !isEmpty(process.env.HOST) ? process.env.HOST : '127.0.0.1',
      ipv6Only: false,
    })
    const address = fastify.server.address()

    if (!address) {
      throw new Error('Server address is not available.')
    }

    if (process.env.NODE_ENV !== 'test') {
      if (process.env.NODE_ENV !== 'development') {
        const port = typeof address === 'string' ? address : address?.port
        console.log(`Server listening at ${port}`)
      } else {
        if (typeof address === 'string') {
          console.log(`Server listening at ${address}`)
        } else {
          let addressMessage = `\n\n\x1b[32mServer listening at\x1b[0m\n`
          for (const addr of fastify.addresses()) {
            addressMessage += `\t • http://${addr.address}:${addr.port}\n`
          }

          console.log(addressMessage)
        }
      }
    }
    return fastify
  } catch (err) {
    console.error((err as Error).message)
  }
}
