import * as z from 'zod/mini'

import { schema, parseArgs, AllocatorActionType } from '../../../../helpers'


const actionTypes = Object.values(AllocatorActionType)
const actionTypeError = `must be one of the following: ${actionTypes.join(', ')}`

export const validateSchema = z.object({
  skip: schema.number,
  limit: schema.number,
  vaultAddress: schema.ethAddressLower,
  userAddress: z.optional(schema.ethAddressLower),
  types: z.optional(schema.array(z.enum(AllocatorActionType, { error: actionTypeError }))),
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
