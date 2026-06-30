import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


const mintSchema = z.extend(baseInputSchema, {
  shares: schema.bigint,
  referrerAddress: z._default(schema.ethAddress, ZeroAddress),
})


export type MintArgs = z.input<typeof mintSchema>

export const validate = (values: unknown) => parseArgs(mintSchema, values)
