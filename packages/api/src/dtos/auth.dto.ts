import { Static, Type } from '@sinclair/typebox'


export const AuthLogin = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

export type AuthLogin = Static<typeof AuthLogin>
