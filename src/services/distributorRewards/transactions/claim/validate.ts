import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


const stringArray = z
  .array(schema.string, { error: 'must be an array' })
  .check(z.minLength(1, { error: 'is an empty array' }))

const claimSchema = z.object({
  proof: stringArray,
  tokens: stringArray,
  userAddress: schema.ethAddress,
  cumulativeAmounts: stringArray,
})


export type ClaimArgs = z.input<typeof claimSchema>

export const validate = (values: unknown) => parseArgs(claimSchema, values)
