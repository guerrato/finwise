import { TObject } from '@sinclair/typebox'

export const map = <R extends object, T extends object, S extends TObject>(obj: T, schema: S): R => {
  const result = {} as R
  const objKeys = Object.keys(obj)
  const schemaKeys = Object.keys(schema.properties)

  for (const key of objKeys) {
    if (schemaKeys.includes(key)) {
      if (typeof schema.properties[key] === 'object') {
        ;(result as TObject)[key] = obj[key as keyof T]
      }
    }
  }

  return result as R
}
