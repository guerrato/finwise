import { Static, Type } from '@sinclair/typebox'


export const CreateUserInput = Type.Object({
  name: Type.String(),
  email: Type.String(),
})

export const User = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
  verified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time'}),
  updatedAt: Type.String({ format: 'date-time'}),
})

export type CreateUserInput = Static<typeof CreateUserInput>
export type User = Static<typeof User>

