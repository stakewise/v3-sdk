import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { schema, parseArgs } from '../../../../helpers'


const mintSchema = z.object({
  shares: schema.bigint,
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  referrerAddress: z._default(schema.ethAddress, ZeroAddress),
})


export type MintArgs = z.input<typeof mintSchema>

export const validate = (values: unknown) => parseArgs(mintSchema, values)
