import { TSchema, Type } from '@sinclair/typebox'
import { isEmpty } from 'utils/string'

export type HTTPResponse<T> = {
  success: boolean
  message?: string | null
  data?: T | null | undefined
  error?: string | null
}

export type ResponseContent<T> = Omit<HTTPResponse<T>, 'success'>

const httpResponse = <T>(response: ResponseContent<T>): HTTPResponse<T> => {
  const { data, error, message } = response
  let success = true

  if (isEmpty(data) && isEmpty(error) && isEmpty(message)) {
    return {
      success: false,
      message: 'data or error or message has to be filled in response',
    }
  }

  if (error && error !== null) {
    success = false
  }

  return {
    success: success ?? false,
    message: message ?? null,
    data: data ?? null,
    error: error ?? null,
  }
}

export const getHTTPResponseSchema = <T extends TSchema>(data: T) =>
  Type.Object({
    success: Type.Boolean({ default: false }),
    data: Type.Optional(Type.Union([data, Type.Null()])),
    message: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    error: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  })

export default httpResponse
