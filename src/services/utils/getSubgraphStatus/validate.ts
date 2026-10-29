import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../helpers'


export const validateSchema = z.object({
  maxLagSeconds: z._default(schema.number, 600),
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
