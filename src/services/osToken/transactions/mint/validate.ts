import { z } from 'zod'
import { ZeroAddress } from 'ethers'

import { schema, parseArgs } from '../../../../helpers'


const mintSchema = z.object({
  shares: schema.bigint,
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  referrerAddress: schema.ethAddress.default(ZeroAddress),
})


export type MintArgs = z.input<typeof mintSchema>

export const validate = (values: unknown) => parseArgs(mintSchema, values)
