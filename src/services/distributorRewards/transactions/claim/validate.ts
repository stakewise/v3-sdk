import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


const stringArray = schema.array(schema.string)

export const validateSchema = z.object({
  proof: stringArray,
  tokens: stringArray,
  userAddress: schema.ethAddress,
  cumulativeAmounts: stringArray,
})


export type ClaimArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
