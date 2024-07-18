import { TSchema } from '@sinclair/typebox'
import { HTTPResponse } from './responses'

type SchemaRequest<T> = {
  body?: T | unknown
  querystring?: T | unknown
  params?: T | unknown
  headers?: T | unknown
}

export const getSchema = <Request extends unknown = never, Response extends TSchema = never>(
  request: SchemaRequest<Request> = {},
  response: Response
) => {
  const { body, headers, params, querystring } = request
  return {
    schema: {
      body,
      headers,
      params,
      querystring,
      response: {
        '2xx': {
          properties: HTTPResponse(response),
        },
      },
    },
    attachValidation: true,
  }
}
