import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  mintedAssets: schema.bigint,
  stakedAssets: schema.bigint,
  liqThresholdPercent: schema.bigint,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
