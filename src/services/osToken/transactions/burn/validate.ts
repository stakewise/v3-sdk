import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


const burnSchema = z.object({
  shares: schema.bigint,
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
})


export type BurnArgs = z.input<typeof burnSchema>

export const validate = (values: unknown) => parseArgs(burnSchema, values)
