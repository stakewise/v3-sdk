import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  position: z.object({
    timestamp: schema.string,
    positionTicket: schema.string,
  }),
  leverageStrategyVersion: z.optional(schema.number),
})

export const validate = (values: unknown) => parseArgs(validateSchema, values)
