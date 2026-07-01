import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  stakedAssets: schema.bigint,
  liqThresholdPercent: schema.bigint,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
