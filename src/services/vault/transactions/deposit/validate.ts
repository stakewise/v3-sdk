import * as z from 'zod/mini'
import { ZeroAddress } from 'ethers'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  assets: schema.bigint,
  referrerAddress: z._default(schema.ethAddress, ZeroAddress),
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
