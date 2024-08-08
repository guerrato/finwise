import { container } from 'tsyringe'
import httpResponse from 'lib/responses'
import { UserService } from 'services'
import { getTokenPayload } from 'utils/security'
import { isEmpty } from 'utils/string'
import { FastifyReply, FastifyRequest } from 'fastify'

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const userService = container.resolve(UserService)
  try {
    if (isEmpty(process.env.JWT_SECRET)) {
      throw new Error('MDW_VAR_MISSING: Internal Error: Variables missing')
    }
    const { authorization } = request.headers

    const token = authorization?.replace('Bearer ', '').trim()

    if (isEmpty(token)) {
      throw new Error('Unauthorized')
    }
    const payload = getTokenPayload(token, process.env.JWT_SECRET)

    if (isEmpty(payload)) {
      throw new Error('Unauthorized')
    }

    if (isEmpty(payload.sub)) {
      throw new Error('Unauthorized')
    }

    const user = await userService.getById(payload.sub)

    if(isEmpty(user)) {
      throw new Error('Unauthorized')
    }

    request.user = {
      id: payload.sub,
      role: payload.role,
    }

  } catch (error) {
    reply.code(401).send(httpResponse({ error: (error as Error).message }))
  }
}
