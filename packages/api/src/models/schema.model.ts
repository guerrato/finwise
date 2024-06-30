import { isEmpty } from "utils/string"

export type SchemaModel<T> = {
  required?: Array<keyof T>
  properties: {
    [Property in keyof T]: {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array'
      format?: string
    }
  }
}

export const assign = <R extends object, T extends object>(obj: T, schema: SchemaModel<R>): R => {
  const schemaKeys = Object.keys(schema.properties)
  const objKeys = Object.keys(obj)
  const result: R = {} as R

  for (const key of objKeys) {
    if (schemaKeys.includes(key)) {
      result[key as keyof R] = (obj as any)[key]
    }
  }

  if (!isEmpty(schema.required)) {
    for (const key of schema.required) {
      if (!(key in result)) {
        throw new Error(`MDL: Missing required key: ${key as string}`)
      }
    }
  }

  return result
}
