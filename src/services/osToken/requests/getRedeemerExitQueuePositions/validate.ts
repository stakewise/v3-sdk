import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


export const validateSchema = z.object({
  userAddress: schema.ethAddress,
  isClaimed: z._default(schema.boolean, false),
})


export const validate = (values: unknown) => parseArgs(validateSchema, values)
