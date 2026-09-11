import * as z from 'zod/mini'

import { schema, parseArgs } from '../../../../helpers'


const positionSchema = z.object({
  positionTicket: schema.string,
  exitQueueIndex: schema.string,
})

export const validateSchema = z.object({
  userAddress: schema.ethAddress,
  positions: schema.array(positionSchema),
})


export type ClaimRedeemerExitQueueArgs = z.input<typeof validateSchema>

export const validate = (values: unknown) => parseArgs(validateSchema, values)
