import { $Enums } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'

export const Account = Type.Object({
  id: Type.String(),
  name: Type.String(),
  currency: Type.Enum($Enums.Currency),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const CreateAccountInput = Type.Object({
  name: Type.String(),
  currency: Type.Enum($Enums.Currency),
  ownerId: Type.String(),
})


export type Account = Static<typeof Account>
export type CreateAccountInput = Static<typeof CreateAccountInput>