import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
  limit: schema.number,
  skip: schema.number,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
