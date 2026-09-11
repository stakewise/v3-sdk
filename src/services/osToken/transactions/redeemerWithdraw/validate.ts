import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  shares: schema.bigint,
  userAddress: schema.ethAddress,
})


export type RedeemerWithdrawArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
