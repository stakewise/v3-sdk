import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  subVaultAddress: schema.ethAddress,
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
