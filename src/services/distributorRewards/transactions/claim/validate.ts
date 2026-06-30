import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


const stringArray = schema.array(schema.string)

const claimSchema = z.object({
  proof: stringArray,
  tokens: stringArray,
  userAddress: schema.ethAddress,
  cumulativeAmounts: stringArray,
})


export type ClaimArgs = z.input<typeof claimSchema>

export const validate = (values: unknown) => parseArgs(claimSchema, values)
