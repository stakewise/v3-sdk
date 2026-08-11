import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  userAddress: schema.ethAddress,
  claimerAddress: schema.ethAddress,
  rewardSplitterAddress: schema.ethAddress,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
