import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  ltvPercent: schema.bigint,
  mintedAssets: schema.bigint,
  stakedAssets: schema.bigint,
  newStakedAssets: schema.bigint,
  vaultAddress: schema.ethAddress,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
