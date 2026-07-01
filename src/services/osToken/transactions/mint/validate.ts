import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  shares: schema.bigint,
  referrerAddress: z._default(schema.ethAddress, ZeroAddress),
})


export type MintArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
