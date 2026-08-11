import * as z from 'zod/mini'

import { schema, parseArgs, baseInputSchema } from '../../../../helpers'


export const validateSchema = z.extend(baseInputSchema, {
  positionTicket: schema.bigint,
  exitQueueIndex: schema.bigint,
})


export type ClaimExitedAssetsArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
