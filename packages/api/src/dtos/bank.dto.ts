import { Static, Type } from '@sinclair/typebox'

export const Bank = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  accountId: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const CreateBankInput = Type.Pick(Bank, ['name', 'description', 'accountId'])

export const UpdateBankInput = Type.Composite([
  Type.Pick(Bank, ['id']),
  Type.Partial(Type.Pick(Bank, ['name', 'description'])),
])

export type CreateBankInput = Static<typeof CreateBankInput>
export type UpdateBankInput = Static<typeof UpdateBankInput>
export type Bank = Static<typeof Bank>
