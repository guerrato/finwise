import { Static, Type } from '@sinclair/typebox'

export const AuthLogin = Type.Object({
  email: Type.String(),
  password: Type.String(),
})

export const AuthLoginSuccess = Type.Object({ token: Type.String() })

export type AuthLogin = Static<typeof AuthLogin>
export type AuthLoginSuccess = Static<typeof AuthLoginSuccess>

