import { isEmpty } from './string'
import { TSchema, Type } from '@sinclair/typebox'

export type HTTPResponse<T> = {
  success: boolean
  message?: string | null
  data?: T | null | undefined
  error?: string | null
}

export const HTTPResponse = <T extends TSchema>(schema: T) =>
  Type.Object({
    success: Type.Boolean(),
    message: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    data: Type.Optional(Type.Union([schema, Type.String(), Type.Null()])),
    error: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  })

export type ResponseContent<T> = Omit<HTTPResponse<T>, 'success'>

export const httpResponse = <T>(response: ResponseContent<T>): HTTPResponse<T> => {
  const { data, error, message } = response
  let success = true

  if (isEmpty(data) && isEmpty(error) && isEmpty(message)) {
    return {
      success: false,
      message: null,
      data: null,
      error: 'data or error or message has to be filled in response',
    }
  }

  if (error && error !== null) {
    success = false
  }

  return {
    success: success ?? null,
    message: message ?? null,
    data: data ?? null,
    error: error ?? null,
  }
}
