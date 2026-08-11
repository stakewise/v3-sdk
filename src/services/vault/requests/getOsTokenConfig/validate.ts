import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
