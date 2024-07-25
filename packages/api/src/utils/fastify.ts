import { TSchema } from '@sinclair/typebox'
import httpResponse, { HTTPResponse } from 'lib/responses'

type SchemaRequest<T> = {
  body?: T | unknown
  querystring?: T | unknown
  params?: T | unknown
  headers?: T | unknown
}

export const getSchema = <Request, Response extends TSchema = never>(
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
          properties: httpResponse(response),
        },
      },
    },
    attachValidation: true,
  }
}
