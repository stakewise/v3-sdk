import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  stakedAssetsDelta: z._default(schema.bigint, 0n),
  mintedSharesDelta: z._default(schema.bigint, 0n),
  boostedSharesDelta: z._default(schema.bigint, 0n),
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
