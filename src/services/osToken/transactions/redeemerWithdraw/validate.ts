import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  shares: schema.bigint,
})


export type RedeemerWithdrawArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
