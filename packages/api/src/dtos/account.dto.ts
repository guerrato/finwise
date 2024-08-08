import { $Enums } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'

export const Account = Type.Object({
  id: Type.String(),
  name: Type.String(),
  currency: Type.Enum($Enums.Currency),
  createdById: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
}, { additionalProperties: false })

export const CreateAccountInput = Type.Pick(Account, ['name', 'currency'])
export const UpdateAccountInput = Type.Composite([
  Type.Pick(Account, ['id']),
  Type.Partial(Type.Pick(Account, ['name', 'currency'])),
])
export const GetAccountInput = Type.Pick(Account, ['id'])
export const DeleteAccountInput = Type.Pick(Account, ['id'])

export type Account = Static<typeof Account>
export type CreateAccountInput = Static<typeof CreateAccountInput>
export type UpdateAccountInput = Static<typeof UpdateAccountInput>
export type GetAccountInput = Static<typeof GetAccountInput>
export type DeleteAccountInput = Static<typeof DeleteAccountInput>