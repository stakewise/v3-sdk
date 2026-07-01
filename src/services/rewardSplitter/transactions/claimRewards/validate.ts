import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  assets: schema.bigint,
  rewardSplitterAddress: schema.ethAddress,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
