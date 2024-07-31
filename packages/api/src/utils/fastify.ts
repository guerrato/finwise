import { TSchema } from '@sinclair/typebox'
import { getHTTPResponseSchema } from 'lib/responses'
import { isEmpty } from './string'

type SchemaRequest<T extends TSchema = never> = {
  body?: T
  querystring?: T
  params?: T
  headers?: T
}

type Schema<Request extends TSchema> = SchemaRequest<Request> & {
  response: { [key: string | number]: ReturnType<typeof getHTTPResponseSchema> }
}

export const getSchema = <Request extends TSchema, Response extends TSchema = never>(
  request: SchemaRequest<Request> = {},
  response: Response
) => {
  const { body, headers, params, querystring } = request

  let schema: Schema<Request> = {
    response: {
      '2xx': getHTTPResponseSchema(response),
    },
  }

  if (!isEmpty(body)) {
    schema.body = body
  }
  if (!isEmpty(headers)) {
    schema.headers = headers
  }
  if (!isEmpty(params)) {
    schema.params = params
  }
  if (!isEmpty(querystring)) {
    schema.querystring = querystring
  }

  return { schema, attachValidation: true }
}
