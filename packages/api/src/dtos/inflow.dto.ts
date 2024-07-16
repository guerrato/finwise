import { $Enums } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'

export const Inflow = Type.Object({
  id: Type.String(),
  amount: Type.Number({ minimum: 0.0001 }),
  datetime: Type.String({ format: 'date-time' }),
  source: Type.Optional(Type.String()),
  type: Type.Enum($Enums.InflowType),
  tithable: Type.Boolean({ default: true }),
  accountId: Type.String(),
  destinationBankId: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const CreateInflowInput = Type.Pick(Inflow, [
  'amount',
  'datetime',
  'source',
  'type',
  'tithable',
  'accountId',
  'destinationBankId',
])
export const UpdateInflowInput = Type.Composite([
  Type.Pick(Inflow, ['id']),
  Type.Partial(
    Type.Pick(Inflow, ['amount', 'datetime', 'source', 'type', 'tithable', 'accountId', 'destinationBankId'])
  ),
])

export type Inflow = Static<typeof Inflow>
export type CreateInflowInput = Static<typeof CreateInflowInput>
export type UpdateInflowInput = Static<typeof UpdateInflowInput>
